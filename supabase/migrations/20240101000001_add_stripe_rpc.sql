-- Skapa en RPC-funktion för att hämta kolumninformation från auth.users
CREATE OR REPLACE FUNCTION public.get_auth_users_columns()
RETURNS TABLE (
    table_name text,
    column_name text,
    data_type text
) LANGUAGE sql SECURITY DEFINER AS $$
    SELECT 
        c.table_name, 
        c.column_name, 
        c.data_type
    FROM 
        information_schema.columns c
    WHERE 
        c.table_schema = 'auth' 
        AND c.table_name = 'users';
$$; 