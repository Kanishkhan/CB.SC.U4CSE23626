import axios from 'axios';
import { Log } from '../logging_middleware/logger';

interface Notification {
    ID: string;
    Type: 'Placement' | 'Result' | 'Event';
    Message: string;
    Timestamp: string;
}

const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJrYW5pc2hraGFuMTIwOUBnbWFpbC5jb20iLCJleHAiOjE3NzgwNTk0NzIsImlhdCI6MTc3ODA1ODU3MiwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImEzYmY2YTM4LTllZTItNGM1NS05MWIwLTVkY2M2ZjhhOGI3MyIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImthbmlzaGtoYW4iLCJzdWIiOiJiMmVhNGMzNC1kODhhLTQ1NmItYjM4YS0wMGFiYmYxNDE5NzQifSwiZW1haWwiOiJrYW5pc2hraGFuMTIwOUBnbWFpbC5jb20iLCJuYW1lIjoia2FuaXNoa2hhbiIsInJvbGxObyI6ImNiLnNjLnU0Y3NlMjM2MjYiLCJhY2Nlc3NDb2RlIjoiUFRCTW1RIiwiY2xpZW50SUQiOiJiMmVhNGMzNC1kODhhLTQ1NmItYjM4YS0wMGFiYmYxNDE5NzQiLCJjbGllbnRTZWNyZXQiOiJlS3dubUNIZktZelRDWVZFIn0.FXJrAPgtm-dIWJR4wRfwX5SGe4YqAMlFqfdjYqp8dO4";
const NOTIFICATIONS_API_URL = "http://20.207.122.201/evaluation-service/notifications";

const TYPE_WEIGHTS = {
    'Placement': 3,
    'Result': 2,
    'Event': 1
};

/**
 * Stage 1: Priority Inbox Logic (Backend)
 * Fetches notifications and determines the top 'n' based on weight and recency.
 */
async function getPriorityNotifications(n: number = 10) {
    await Log('backend', 'info', 'service', "Starting priority notification processing.");
    
    try {
        const response = await axios.get(NOTIFICATIONS_API_URL, {
            headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
        });
        
        const notifications: Notification[] = response.data.notifications;
        await Log('backend', 'info', 'service', `Fetched ${notifications.length} notifications from server.`);

        // Sort by Weight (Type) then Recency (Timestamp)
        const sorted = notifications.sort((a, b) => {
            const weightA = TYPE_WEIGHTS[a.Type] || 0;
            const weightB = TYPE_WEIGHTS[b.Type] || 0;

            if (weightA !== weightB) {
                return weightB - weightA;
            }

            return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
        });

        const topN = sorted.slice(0, n);
        await Log('backend', 'info', 'service', `Sorted and identified top ${n} notifications.`);
        
        return topN;
    } catch (error: any) {
        await Log('backend', 'error', 'service', `Failed to process notifications: ${error.message}`);
        throw error;
    }
}

async function main() {
    try {
        const top10 = await getPriorityNotifications(10);
        console.log("\n--- Top 10 Priority Notifications (Final Result) ---");
        top10.forEach((notif, i) => {
            console.log(`${i+1}. [${notif.Type}] ${notif.Message} (${notif.Timestamp})`);
        });
    } catch (err) {
        // Logged inside getPriorityNotifications
    }
}

main();
