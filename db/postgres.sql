CREATE TABLE banks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    balance FLOAT DEFAULT 0
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL
);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    bank_id INTEGER NOT NULL REFERENCES banks ON DELETE RESTRICT,
    timestamp timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transaction_categories (
    id SERIAL PRIMARY KEY,
    amount FLOAT NOT NULL,
    category_id INTEGER NOT NULL REFERENCES categories ON DELETE RESTRICT,
    transaction_id INTEGER NOT NULL REFERENCES transactions ON DELETE CASCADE
);

CREATE OR REPLACE FUNCTION tr_transaction_categories_insert_fnc()
RETURNS trigger AS
$$
    BEGIN
        UPDATE banks SET balance = balance + NEW.amount WHERE id = NEW.bank_id;

        RETURN NEW;
    END;
$$
LANGUAGE 'plpgsql';

CREATE TRIGGER tr_transaction_categories_insert
AFTER INSERT ON transaction_categories
FOR EACH ROW
EXECUTE FUNCTION tr_transaction_categories_insert_fnc();