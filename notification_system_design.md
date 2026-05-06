# Notification System Design

## Overview
A full-stack campus notification platform that provides real-time updates for Placements, Results, and Events. The system features a **Priority Inbox** that algorithmically ranks notifications based on critical business weights.

## Project Structure
Following the required guidelines:
- `logging_middleware/`: Reusable package for remote logging.
- `notification_app_be/`: Backend logic (Stage 1) for prioritized notification fetching.
- `notification_app_fe/`: Responsive Next.js application (Stage 2).
- `notification_system_design.md`: This documentation.

## Core Logic: Prioritization Algorithm
Notifications are prioritized using:
1. **Business Weights**:
   - `Placement`: 3 (Highest)
   - `Result`: 2
   - `Event`: 1 (Lowest)
2. **Recency**: Tie-breaker based on `Timestamp`.

## Logging Strategy (Middleware)
A custom `Log(stack, level, package, message)` function integrates with the Central Test Server.
- **Endpoint**: `http://20.207.122.201/evaluation-service/logs`
- **Security**: Authenticated via JWT Bearer Token.
- **Packages Used**:
  - Backend: `service`, `utils`.
  - Frontend: `api`, `component`, `state`.

## Frontend Implementation (Stage 2)
Built with **Next.js 14+** and **Material UI (MUI)**:
- **Responsive Dashboard**: Optimized for Mobile and Desktop views.
- **Dynamic Filtering**: Tabs to filter by category.
- **Priority Toggle**: Instant calculation of top 10 ranked items.
- **Read/Unread Tracking**: Client-side persistence using `localStorage` to distinguish new notifications.
- **Real-time Interaction**: Hover effects and smooth transitions using MUI components.

## Authentication
Both the Backend and Frontend use a secure JWT token obtained from the `/auth` endpoint using registered `clientID` and `clientSecret`.

## Screenshots and Verification
Output screenshots of the running application are provided in the repository (as per Stage 2 requirements).
- Mobile View: Optimized list layout.
- Desktop View: Enhanced grid layout with filtering.
