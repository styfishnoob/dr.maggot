#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <algorithm>
#include <cmath>
#include "json.hpp"

using json = nlohmann::json;

const int VIDEO_WIDTH = 1920;
const int VIDEO_HEIGHT = 1080;
const int LANE_HEIGHT = 60;
const int NUM_LANES = VIDEO_HEIGHT / LANE_HEIGHT;
const double DURATION_ON_SCREEN = 8.0; // seconds

struct Comment {
    double content_offset_seconds;
    std::string body;
    std::string color;
    double estimated_width;
};

struct Lane {
    double available_at = 0.0;
};

// Simple estimation of text width. A more accurate method would require a font rendering library.
double estimate_text_width(const std::string& text) {
    // Monospaced approximation: each character is roughly half the height.
    // This is a very rough estimate.
    return text.length() * (LANE_HEIGHT / 2.0);
}

// Check for collision. A comment collides if it enters a lane before the previous comment has fully exited.
bool check_collision(const Comment& c, const Lane& l) {
    // Time when the new comment will start to appear on screen
    double new_comment_enter_time = c.content_offset_seconds;
    // Time when the previous comment in the lane will be fully off-screen
    double prev_comment_exit_time = l.available_at;

    return new_comment_enter_time < prev_comment_exit_time;
}

// Speed of the comment to cross the screen
double calculate_speed(double width) {
    return (VIDEO_WIDTH + width) / DURATION_ON_SCREEN;
}


int main() {
    std::ifstream f("/app/danmaku-renderer-poc/comments.json");
    if (!f.is_open()) {
        std::cerr << "Error: Could not open /app/danmaku-renderer-poc/comments.json" << std::endl;
        return 1;
    }
    json data = json::parse(f);

    std::vector<Comment> comments;
    for (const auto& item : data["comments"]) {
        Comment c;
        c.content_offset_seconds = item["content_offset_seconds"];
        c.body = item["message"]["body"];
        c.color = item["user_color"].is_null() ? "ffffff" : item["user_color"].get<std::string>().substr(1);
        c.estimated_width = estimate_text_width(c.body);
        comments.push_back(c);
    }

    std::sort(comments.begin(), comments.end(), [](const Comment& a, const Comment& b) {
        return a.content_offset_seconds < b.content_offset_seconds;
    });

    std::vector<Lane> lanes(NUM_LANES);
    std::string filter_graph = "";

    for (const auto& comment : comments) {
        int target_lane = -1;
        for (int i = 0; i < NUM_LANES; ++i) {
            if (!check_collision(comment, lanes[i])) {
                target_lane = i;
                break;
            }
        }

        if (target_lane == -1) {
            // If all lanes are occupied, find the one that becomes available soonest
            target_lane = 0;
            for (int i = 1; i < NUM_LANES; ++i) {
                if (lanes[i].available_at < lanes[target_lane].available_at) {
                    target_lane = i;
                }
            }
        }

        double speed = calculate_speed(comment.estimated_width);
        double time_to_disappear = comment.estimated_width / speed;

        lanes[target_lane].available_at = comment.content_offset_seconds + time_to_disappear;

        double y_pos = target_lane * LANE_HEIGHT + (LANE_HEIGHT / 2.0);

        filter_graph += "drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:text='" + comment.body +
                        "':fontcolor=" + comment.color +
                        ":fontsize=" + std::to_string(LANE_HEIGHT - 10) +
                        ":y=" + std::to_string(y_pos) +
                        ":x='w-" + std::to_string(speed) + "* (t-" + std::to_string(comment.content_offset_seconds) + ")" +
                        "':enable='between(t," + std::to_string(comment.content_offset_seconds) + "," + std::to_string(comment.content_offset_seconds + DURATION_ON_SCREEN) + ")',";
    }

    if (!filter_graph.empty()) {
        filter_graph.pop_back(); // Remove trailing comma
    }

    std::cout << "ffmpeg -y -f lavfi -i color=c=black:s=1920x1080:d=30 -vf \"" << filter_graph << "\" final_output.mp4" << std::endl;

    return 0;
}
