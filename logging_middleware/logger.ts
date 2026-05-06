import axios from 'axios';

const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJrYW5pc2hraGFuMTIwOUBnbWFpbC5jb20iLCJleHAiOjE3NzgwNTk0NzIsImlhdCI6MTc3ODA1ODU3MiwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImEzYmY2YTM4LTllZTItNGM1NS05MWIwLTVkY2M2ZjhhOGI3MyIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImthbmlzaGtoYW4iLCJzdWIiOiJiMmVhNGMzNC1kODhhLTQ1NmItYjM4YS0wMGFiYmYxNDE5NzQifSwiZW1haWwiOiJrYW5pc2hraGFuMTIwOUBnbWFpbC5jb20iLCJuYW1lIjoia2FuaXNoa2hhbiIsInJvbGxObyI6ImNiLnNjLnU0Y3NlMjM2MjYiLCJhY2Nlc3NDb2RlIjoiUFRCTW1RIiwiY2xpZW50SUQiOiJiMmVhNGMzNC1kODhhLTQ1NmItYjM4YS0wMGFiYmYxNDE5NzQiLCJjbGllbnRTZWNyZXQiOiJlS3dubUNIZktZelRDWVZFIn0.FXJrAPgtm-dIWJR4wRfwX5SGe4YqAMlFqfdjYqp8dO4";
const LOG_API_URL = "http://20.207.122.201/evaluation-service/logs";

/**
 * Mandatory Logging Middleware for campus evaluation.
 * Sends logs to the central test server.
 * 
 * @param stack 'backend' | 'frontend'
 * @param level 'debug' | 'info' | 'warn' | 'error' | 'fatal'
 * @param package Specific package name from the allowed list
 * @param message The log message string
 */
export async function Log(
    stack: 'backend' | 'frontend',
    level: 'debug' | 'info' | 'warn' | 'error' | 'fatal',
    pkg: string,
    message: string
) {
    const payload = {
        stack: stack.toLowerCase(),
        level: level.toLowerCase(),
        package: pkg.toLowerCase(),
        message: message
    };

    try {
        const response = await axios.post(LOG_API_URL, payload, {
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        
        // Optional: Local console log for development debugging only
        // console.log(`[Remote Log Success] ID: ${response.data.logID}`);
        return response.data;
    } catch (error: any) {
        // Fallback to local console error if the logging server is down
        console.error("Failed to send remote log:", error.response ? error.response.data : error.message);
    }
}
