const cron = require('node-cron');
const pool = require('../config/db');

function dailyTourCheck() {
    cron.schedule('0 0 * * *', async () => {
        try {
            console.log('Running daily tour completion check...');
            await pool.query(`
                UPDATE tours
                SET tour_status = 'completed',
                    travel_status = 'completed',
                    completion_status = CASE
                        WHEN completion_status = 'not-uploaded' THEN 'pending-verification'
                        ELSE completion_status
                    END,
                    updated_at = NOW()
                WHERE to_date < CURRENT_DATE
                AND tour_status != 'completed'
            `);
            console.log('Tour completion check completed');
        } catch (error) {
            console.error('Error in daily tour completion check:', error);
        }
    });
}

module.exports = dailyTourCheck;
