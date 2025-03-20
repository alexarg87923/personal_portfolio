-- Create the table
CREATE TABLE personal_portfolio_schema.about (
  id SERIAL PRIMARY KEY,
  summary TEXT,
  active BOOLEAN DEFAULT false,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX personal_portfolio_schema.single_active_idx ON personal_portfolio_schema.about (active)
WHERE active = true;

CREATE OR REPLACE FUNCTION personal_portfolio_schema.check_single_active()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        IF NEW.active THEN
            IF EXISTS (SELECT 1 FROM personal_portfolio_schema.about WHERE active AND id != NEW.id) THEN
                RAISE EXCEPTION 'Only one row can have active = TRUE';
            END IF;
        END IF;
    END IF;

    IF TG_OP = 'DELETE' THEN
        IF OLD.active THEN
            RAISE EXCEPTION 'Cannot delete the only row with active = TRUE';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER personal_portfolio_schema.single_active_trigger
BEFORE INSERT OR UPDATE OR DELETE ON personal_portfolio_schema.about
FOR EACH ROW
EXECUTE PROCEDURE personal_portfolio_schema.check_single_active();
