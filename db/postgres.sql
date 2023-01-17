CREATE TYPE user_status AS ENUM ('admin', 'player', 'banned');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(20) NOT NULL,
    email VARCHAR(320) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    status user_status NOT NULL,
    active BOOLEAN NOT NULL,
    timestamp timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_update_timestamp timestamp
);

CREATE OR REPLACE FUNCTION tr_user_isert_fnc()
RETURNS trigger AS
$$
    BEGIN
        INSERT INTO maps(user_id) VALUES(NEW.id);
        RETURN NEW;
    END;
$$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION tr_update_fnc()
RETURNS trigger AS
$$
    BEGIN
        NEW.last_update_timestamp = now();
        RETURN NEW;
    END;
$$
LANGUAGE 'plpgsql';

CREATE TRIGGER tr_users_update
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION tr_update_fnc();

CREATE TABLE resources (
    id SERIAL PRIMARY KEY,
    amount INTEGER NOT NULL CHECK (amount > 0)
);

CREATE TABLE bases (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users ON DELETE CASCADE,
    storage INTEGER DEFAULT 0 CHECK (storage > -1)
);

CREATE TABLE bots (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users ON DELETE CASCADE,
    storage INTEGER DEFAULT 0 CHECK (storage > -1)
);

CREATE TABLE points (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users ON DELETE CASCADE,
    x INTEGER NOT NULL,
    y INTEGER NOT NULL,
    resource_id INTEGER REFERENCES resources ON DELETE SET NULL,
    base_id INTEGER REFERENCES bases ON DELETE SET NULL,
    bot_id INTEGER REFERENCES bots ON DELETE SET NULL,
    
    UNIQUE (x, y)
);

CREATE OR REPLACE FUNCTION tr_points_update_resource_id_fnc()
RETURNS trigger AS
$$
    BEGIN
        NEW.base_id = NULL;
        NEW.bot_id = NULL;

        RETURN NEW;
    END;
$$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION tr_points_update_base_id_fnc()
RETURNS trigger AS
$$
    BEGIN
        NEW.resource_id = NULL;
        NEW.bot_id = NULL;

        RETURN NEW;
    END;
$$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION tr_points_update_bot_id_fnc()
RETURNS trigger AS
$$
    BEGIN

        NEW.base_id = NULL;
        NEW.resource_id = NULL;

        RETURN NEW;
    END;
$$
LANGUAGE 'plpgsql';

CREATE TRIGGER tr_points_update_resource_id
BEFORE UPDATE OF resource_id ON points
FOR EACH ROW
EXECUTE FUNCTION tr_points_update_resource_id_fnc();

CREATE TRIGGER tr_points_update_base_id
BEFORE UPDATE OF base_id ON points
FOR EACH ROW
EXECUTE FUNCTION tr_points_update_base_id_fnc();

CREATE TRIGGER tr_points_update_bot_id
BEFORE UPDATE OF bot_id ON points
FOR EACH ROW
EXECUTE FUNCTION tr_points_update_bot_id_fnc();

CREATE TYPE command_status AS ENUM('created', 'in_process', 'completed');

CREATE TABLE commands (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL,
    status command_status NOT NULL,
    timestamp timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_update_timestamp timestamp
);

CREATE TRIGGER tr_commands_update
BEFORE UPDATE ON commands
FOR EACH ROW
EXECUTE FUNCTION tr_update_fnc();