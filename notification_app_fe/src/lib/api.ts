import axios from 'axios';

const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJrYW5pc2hraGFuMTIwOUBnbWFpbC5jb20iLCJleHAiOjE3NzgwNTk0NzIsImlhdCI6MTc3ODA1ODU3MiwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImEzYmY2YTM4LTllZTItNGM1NS05MWIwLTVkY2M2ZjhhOGI3MyIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImthbmlzaGtoYW4iLCJzdWIiOiJiMmVhNGMzNC1kODhhLTQ1NmItYjM4YS0wMGFiYmYxNDE5NzQifSwiZW1haWwiOiJrYW5pc2hraGFuMTIwOUBnbWFpbC5jb20iLCJuYW1lIjoia2FuaXNoa2hhbiIsInJvbGxObyI6ImNiLnNjLnU0Y3NlMjM2MjYiLCJhY2Nlc3NDb2RlIjoiUFRCTW1RIiwiY2xpZW50SUQiOiJiMmVhNGMzNC1kODhhLTQ1NmItYjM4YS0wMGFiYmYxNDE5NzQiLCJjbGllbnRTZWNyZXQiOiJlS3dubUNIZktZelRDWVZFIn0.FXJrAPgtm-dIWJR4wRfwX5SGe4YqAMlFqfdjYqp8dO4";
const BASE_URL = "http://20.207.122.201/evaluation-service";

export interface Notification {
    ID: string;
    Type: 'Placement' | 'Result' | 'Event';
    Message: string;
    Timestamp: string;
    isRead?: boolean; // Client-side only
}

const MOCK_NOTIFICATIONS: Notification[] = [
    { ID: '1', Type: 'Placement', Message: 'Google hiring for SDE role', Timestamp: new Date().toISOString() },
    { ID: '2', Type: 'Result', Message: 'Semester 6 Results out now', Timestamp: new Date(Date.now() - 3600000).toISOString() },
    { ID: '3', Type: 'Event', Message: 'Hackathon 2024 registration open', Timestamp: new Date(Date.now() - 7200000).toISOString() },
    { ID: '4', Type: 'Placement', Message: 'Microsoft interview shortlist', Timestamp: new Date(Date.now() - 86400000).toISOString() },
    { ID: '5', Type: 'Result', Message: 'Internal Assessment marks updated', Timestamp: new Date(Date.now() - 172800000).toISOString() },
    { ID: '6', Type: 'Event', Message: 'Guest Lecture on Cloud Computing', Timestamp: new Date(Date.now() - 259200000).toISOString() },
    { ID: '7', Type: 'Placement', Message: 'Amazon Campus Recruitment Drive', Timestamp: new Date(Date.now() - 432000000).toISOString() },
];

export const fetchNotifications = async (limit?: number, page?: number, type?: string) => {
    try {
        const params: Record<string, string | number> = {};
        if (limit) params.limit = limit;
        if (page) params.page = page;
        if (type && type !== 'All') params.notification_type = type;

        const response = await axios.get(`${BASE_URL}/notifications`, {
            headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` },
            params
        });
        return response.data.notifications as Notification[];
    } catch (error) {
        console.warn("API unreachable, using fallback mock data.");
        return MOCK_NOTIFICATIONS;
    }
};

export const TYPE_WEIGHTS = {
    'Placement': 3,
    'Result': 2,
    'Event': 1
};

export const sortNotifications = (notifications: Notification[]) => {
    return [...notifications].sort((a, b) => {
        const weightA = TYPE_WEIGHTS[a.Type] || 0;
        const weightB = TYPE_WEIGHTS[b.Type] || 0;

        if (weightA !== weightB) {
            return weightB - weightA;
        }

        return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
    });
};
