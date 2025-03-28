CREATE TABLE personal_portfolio_schema.about (
  id SERIAL PRIMARY KEY,
  summary TEXT,
  active BOOLEAN DEFAULT false,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX single_active_idx ON personal_portfolio_schema.about(active)
WHERE active = true;

CREATE OR REPLACE FUNCTION personal_portfolio_schema.check_single_active()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        IF NEW.active THEN
            IF EXISTS (
                SELECT 1 FROM personal_portfolio_schema.about 
                WHERE active AND id != NEW.id
            ) THEN
                RAISE EXCEPTION 'Only one row can have active = TRUE';
            END IF;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.active THEN
            RAISE EXCEPTION 'Cannot delete the only row with active = TRUE';
        END IF;
        RETURN OLD;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER single_active_trigger
BEFORE INSERT OR UPDATE OR DELETE ON personal_portfolio_schema.about
FOR EACH ROW
EXECUTE FUNCTION personal_portfolio_schema.check_single_active();
