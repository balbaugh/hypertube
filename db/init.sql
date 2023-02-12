
SET timezone = 'Europe/Helsinki';


CREATE TABLE IF NOT EXISTS users ( id SERIAL NOT NULL PRIMARY KEY,
																																			email VARCHAR(255) NOT NULL,
																																			username VARCHAR(255) NOT NULL,
																																			firstname VARCHAR(255) NOT NULL,
																																			lastname VARCHAR(255) NOT NULL,
																																			password VARCHAR(255) NOT NULL,
																																			verifycode VARCHAR(255) NOT NULL,
																																			status INT DEFAULT 0 NOT NULL);


CREATE TABLE IF NOT EXISTS movies ( id SERIAL NOT NULL PRIMARY KEY,
																																				movie_path VARCHAR(255) NOT NULL,
																																				size VARCHAR(255) NOT NULL,
																																				downloaded BOOLEAN DEFAULT false NOT NULL, date TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

