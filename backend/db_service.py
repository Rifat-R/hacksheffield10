from supabase_client import supabase

def get_all(table_name):
    """Get all records from a table."""
    response = supabase.table(table_name).select('*').execute()
    return response.data

def get_by_id(table_name, record_id):
    """Get a single record by ID."""
    response = supabase.table(table_name).select('*').eq('id', record_id).execute()
    return response.data[0] if response.data else None

def create_record(table_name, data):
    """Create a new record."""
    response = supabase.table(table_name).insert(data).execute()
    return response.data[0] if response.data else None

def update_record(table_name, record_id, updates):
    """Update an existing record by ID."""
    response = supabase.table(table_name).update(updates).eq('id', record_id).execute()
    return response.data[0] if response.data else None

def delete_record(table_name, record_id):
    """Delete a record by ID."""
    response = supabase.table(table_name).delete().eq('id', record_id).execute()
    return response.data[0] if response.data else None