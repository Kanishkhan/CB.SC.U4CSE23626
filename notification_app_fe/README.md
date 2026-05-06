# Campus Notification System

A full-stack campus notification platform that provides real-time updates for Placements, Results, and Events. The system features a Priority Inbox that ranks notifications based on business weights and recency.

## Project Structure

- `logging_middleware/`: Reusable package for remote logging integration.
- `notification_app_be/`: Backend logic for prioritized notification processing.
- `notification_app_fe/`: Responsive Next.js application built with Material UI.
- `notification_system_design.md`: Technical documentation of the system design and prioritization algorithm.

## Features

- **Priority Inbox**: Algorithmically ranks notifications (Placements > Results > Events).
- **Category Filtering**: Filter notifications by type using a tabbed interface.
- **Read/Unread Tracking**: Persists viewed status locally for an improved user experience.
- **Remote Logging**: Strategic integration with the central test server for observability.
- **Responsive UI**: Optimized for both mobile and desktop devices.

## Setup and Installation

### Backend verification
Run the Stage 1 priority logic script:
```bash
npx ts-node notification_app_be/priorityInbox.ts
```

### Frontend development
Install dependencies and start the Next.js server:
```bash
cd notification_app_fe
npm install
npm run dev
```

The application will be available at `http://localhost:3000`.
