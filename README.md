# YouTube Recommendation Algorithm

This project implements a recommendation algorithm for YouTube videos. It filters videos based on user interests and calculates weights for each video based on user interactions such as watch percentage, likes, dislikes, shares, and subscriptions.

## Features

- Filter videos based on user categories.
- Calculate weights for each video based on user interactions.
- Retrieve the top 10 videos with the highest scores.
- 
## Installation
Clone the repository
npm install

## How It Works

1. **Mock User and Weights**:
    - A mock user is created with specific category interests.
    - Weights are assigned to various user interactions (e.g., likes, dislikes, watch percentage).

2. **Filter Personalization**:
    - The `filterPersonalizaton` function filters videos based on user categories from `viewerPersonalization.json`.

3. **Calculate Weights**:
    - The `calculateWeight` function calculates a weight for each video based on user interactions and predefined weights.

4. **Get Top Ten Videos**:
    - The `getTopTenVideos` function groups videos by their ID, calculates the average weight for each group, and retrieves the top 10 videos with the highest scores.


