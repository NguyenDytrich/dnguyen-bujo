/**
 * This script will not run if any of the tables exists.
 * It assumes this will be run on an empty database.
 */

BEGIN;

-- List of all tasks
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    "text" VARCHAR(255) NOT NULL,
    notes TEXT,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    completed BOOLEAN DEFAULT FALSE
);

COMMIT;