ALTER TABLE orders ADD COLUMN guest_payload_hash TEXT;
CREATE UNIQUE INDEX orders_guest_request ON orders(request_key) WHERE guest_payload_hash IS NOT NULL;
CREATE TABLE guest_checkout_settings (id INTEGER PRIMARY KEY CHECK (id = 1), ip_key TEXT NOT NULL);
INSERT INTO guest_checkout_settings (id, ip_key) VALUES (1, lower(hex(randomblob(32))));
