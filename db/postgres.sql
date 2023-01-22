CREATE TABLE banks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    balance FLOAT DEFAULT 0
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    bank_id INTEGER NOT NULL REFERENCES banks ON DELETE RESTRICT,
    timestamp timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE transaction_categories (
    id SERIAL PRIMARY KEY,
    amount FLOAT NOT NULL,
    category_id INTEGER NOT NULL REFERENCES categories ON DELETE RESTRICT,
    transaction_id INTEGER REFERENCES transactions ON DELETE CASCADE,

    UNIQUE (category_id, transaction_id)
);

CREATE OR REPLACE FUNCTION tr_transaction_categories_insert_fnc()
RETURNS trigger AS
$$
    BEGIN
        UPDATE banks SET balance = balance + NEW.amount WHERE id = (SELECT bank_id FROM transactions WHERE id = NEW.transaction_id);

        RETURN NEW;
    END;
$$
LANGUAGE 'plpgsql';

CREATE TRIGGER tr_transaction_categories_insert
AFTER INSERT ON transaction_categories
FOR EACH ROW
EXECUTE FUNCTION tr_transaction_categories_insert_fnc();

CREATE OR REPLACE FUNCTION tr_transactions_delete_fnc()
RETURNS trigger AS
$$
    BEGIN
        UPDATE banks SET balance = balance - (SELECT SUM(amount) FROM transaction_categories WHERE transaction_id = OLD.id) WHERE id = OLD.bank_id;

        RETURN OLD;
    END;
$$
LANGUAGE 'plpgsql';

CREATE TRIGGER tr_transactions_delete
BEFORE DELETE ON transactions
FOR EACH ROW
EXECUTE FUNCTION tr_transactions_delete_fnc();