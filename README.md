# 🎓 Full-Stack Campus Notification Platform

## 📋 Project Overview
A comprehensive notification system designed to streamline campus communication. This repository contains a production-grade implementation of a prioritized notification engine, featuring a React/Next.js frontend, a Node.js backend, and a custom logging infrastructure.

### 🏗 Repository Structure
| Component | Path | Description |
| :--- | :--- | :--- |
| **Frontend** | `/notification_app_fe` | Next.js 15 + MUI dashboard with priority sorting. |
| **Backend** | `/notification_app_be` | Node.js API services for notification management. |
| **Middleware** | `/logging_middleware` | Shared package for remote system observability. |
| **Design** | `notification_system_design.md` | Core logic and architectural specifications. |

---

## ⚡ Quick Start

### 1. Prerequisites
Ensure you have **Node.js 18+** installed.

### 2. Implementation Stages

#### Stage 1: Priority Algorithm (Backend)
Verify the core ranking logic:
```bash
npx ts-node notification_app_be/priorityInbox.ts
```

#### Stage 2: Dashboard (Frontend)
Launch the responsive UI:
```bash
cd notification_app_fe
npm install
npm run dev
```
Navigate to: `http://localhost:3000`

---

## 🎯 Key Technical Implementations

### 1. Weighted Ranking Engine
Notifications are dynamically sorted based on a proprietary weight-age formula:
- **Critical (Weight 3)**: Placement Drives & Career Opportunities.
- **Important (Weight 2)**: Academic Results & Official Notifications.
- **Standard (Weight 1)**: General Events & Activities.
*Tie-breaker: Chronological order (Most recent first).*

### 2. Distributed Logging
A centralized logging system is integrated across all modules, pushing real-time telemetry to the evaluation server. This demonstrates:
- Cross-package dependency management.
- Secure API communication via JWT.
- Error handling and system health monitoring.

### 3. Responsive UX
The dashboard is optimized for student usage patterns, offering:
- **Smart Filters**: Quick access to specific notification types.
- **Persistence**: "Mark as Read" functionality stored client-side for immediate feedback.
- **Performance**: Optimized rendering using React 19 features.

---

## 🔍 Evaluation Focus Areas
- **Code Quality**: Modular architecture with TypeScript for type safety.
- **System Design**: Separation of concerns between UI, Business Logic, and Logging.
- **Documentation**: Comprehensive READMEs and design docs for maintainability.

---

**Built for the Campus Hiring Evaluation Pipeline.**
