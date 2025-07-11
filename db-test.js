const { Pool } = require('pg');
// Only for testing, if someone wanted to test DB connection locally can use this Node db-test.js
const config = {
    db: {
        url: "postgresql://dummy:dummy@localhost:5432/services",
    }
};

const pool = new Pool({
    connectionString: config.db.url,
});

async function testConnection(retries = 5) {
    let client;
    while (retries > 0) {
        try {
            console.log('Attempting to connect to database...');
            client = await pool.connect();
            const res = await client.query('SELECT NOW() as current_time');
            console.log('Database connection successful!');
            console.log('Current database time:', res.rows[0].current_time);
            return true;
        } catch (err) {
            console.error('Database connection failed:', err.message);
            retries -= 1;
            console.log(`Retries left: ${retries}`);
            await new Promise(res => setTimeout(res, 2000)); // Wait before retrying
        } finally {
            if (client) client.release();
        }
    }
    return false;
}

testConnection().then(success => {
    process.exit(success ? 0 : 1);
});
