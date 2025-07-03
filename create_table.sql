CREATE TABLE medicines (
  id serial PRIMARY KEY,
  name varchar(50) NOT NULL,
  dosage varchar(20),         
  unit varchar(10),           
  instructions varchar(100),  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE medicine_schedules (
  id serial PRIMARY KEY,
  medicine_id int REFERENCES medicines(id) ON DELETE CASCADE,
  datetime TIMESTAMP NOT NULL  
);

CREATE TABLE medicine_logs (
  id SERIAL PRIMARY KEY,
  medicine_id INTEGER REFERENCES medicines(id) ON DELETE CASCADE,
  schedule_id INTEGER REFERENCES medicine_schedules(id) ON DELETE CASCADE,
  datetime TIMESTAMP NOT NULL,
  taken BOOLEAN DEFAULT FALSE 
);

SELECT * FROM medicines;
SELECT * FROM medicine_schedules;
SELECT * FROM medicine_logs;