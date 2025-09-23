#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <cmath>
#include <locale>
#include <sstream> // For stringstream
#include <iomanip> // For std::quoted

#include "json.hpp"

// for convenience
using json = nlohmann::json;

const int VIDEO_WIDTH = 1920;
const int FONT_SIZE = 48;
const double DURATION = 5.0;
const int NUM_LANES = 10;
const int LINE_HEIGHT = FONT_SIZE + 10; // A bit of padding
const char* FONT_FILE = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf";
const char* INPUT_VIDEO = "dummy_video.mp4";
const char* OUTPUT_VIDEO = "final_output.mp4";

// Function to escape single quotes for ffmpeg drawtext
std::string escape_for_ffmpeg(const std::string& text) {
    std::string escaped;
    for (char c : text) {
        if (c == '\'') {
            escaped += "'\\''";
        } else {
            escaped += c;
        }
    }
    return escaped;
}

double estimate_text_width(const std::string& text, int font_size) {
    double width = 0;
    std::setlocale(LC_ALL, "en_US.UTF-8");
    wchar_t wc;
    int i = 0;
    while (i < text.length()) {
        int bytes_consumed = std::mbtowc(&wc, &text[i], text.length() - i);
        if (bytes_consumed <= 0) {
            width += 0.5 * font_size;
            i++;
            continue;
        }
        if (wc > 127) {
            width += 1.0 * font_size;
        } else {
            width += 0.5 * font_size;
        }
        i += bytes_consumed;
    }
    return width;
}

struct Comment {
    double startTime;
    double width;
    double speed;
    std::string text;
    std::string color;
};

struct Lane {
    Comment lastComment;
    bool hasLastComment = false;
};

bool check_collision(const Comment& new_comment, const Lane& lane) {
    if (!lane.hasLastComment) return true;
    const Comment& last_comment = lane.lastComment;
    if (new_comment.startTime >= last_comment.startTime + DURATION) return true;
    if (new_comment.speed <= last_comment.speed) return true;
    double lc_elapsed_time = new_comment.startTime - last_comment.startTime;
    const double lc_time_to_appear = last_comment.width / last_comment.speed;
    if (lc_elapsed_time < lc_time_to_appear) return false;
    const double catch_up_time = (last_comment.speed * (lc_elapsed_time - lc_time_to_appear)) / (new_comment.speed - last_comment.speed);
    const double lc_time_remaining = DURATION - lc_elapsed_time;
    return catch_up_time > lc_time_remaining;
}

int main() {
    std::ifstream f("comments.json");
    if (!f.is_open()) {
        std::cerr << "Error: Could not open comments.json" << std::endl;
        return 1;
    }

    json data;
    try {
        data = json::parse(f);
    } catch (json::parse_error& e) {
        std::cerr << "Parse error: " << e.what() << std::endl;
        return 1;
    }

    if (data.find("comments") == data.end() || !data["comments"].is_array()) {
        std::cerr << "Error: 'comments' key not found or is not an array." << std::endl;
        return 1;
    }

    std::vector<Lane> lanes(NUM_LANES);
    std::stringstream filter_graph;

    bool first_filter = true;

    for (const auto& c : data["comments"]) {
        try {
            Comment new_comment;
            new_comment.startTime = c["content_offset_seconds"];
            new_comment.text = c["message"]["body"];
            new_comment.width = estimate_text_width(new_comment.text, FONT_SIZE);
            new_comment.speed = (VIDEO_WIDTH + new_comment.width) / DURATION;

            if (c["message"].contains("user_color") && !c["message"]["user_color"].is_null()) {
                new_comment.color = c["message"]["user_color"].get<std::string>().substr(1); // Remove '#'
            } else {
                new_comment.color = "FFFFFF"; // Default to white
            }

            for (int i = 0; i < NUM_LANES; ++i) {
                if (check_collision(new_comment, lanes[i])) {
                    lanes[i].lastComment = new_comment;
                    lanes[i].hasLastComment = true;

                    if (!first_filter) {
                        filter_graph << ",";
                    }
                    filter_graph << "drawtext="
                                 << "fontfile='" << FONT_FILE << "':"
                                 << "text='" << escape_for_ffmpeg(new_comment.text) << "':"
                                 << "fontcolor=0x" << new_comment.color << ":"
                                 << "fontsize=" << FONT_SIZE << ":"
                                 << "borderw=2:bordercolor=black:"
                                 << "y=" << i * LINE_HEIGHT << ":"
                                 << "x='w-(" << new_comment.speed << ")*(t-" << new_comment.startTime << ")':"
                                 << "enable='between(t," << new_comment.startTime << "," << new_comment.startTime + DURATION << ")'";

                    first_filter = false;
                    break;
                }
            }
        } catch (json::type_error& e) {
            std::cerr << "Type error while processing a comment: " << e.what() << std::endl;
        }
    }

    // Output the final ffmpeg command
    std::cout << "ffmpeg -i " << INPUT_VIDEO
              << " -vf \"" << filter_graph.str() << "\""
              << " -c:a copy " << OUTPUT_VIDEO << std::endl;

    return 0;
}
