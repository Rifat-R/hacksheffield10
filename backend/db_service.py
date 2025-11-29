from supabase_client import supabase

def get_all(table_name):
    response = supabase.table(table_name).select('*').execute()
    if response.error:
        raise Exception(response.error)
    return response.data

def get_by_id(table_name, record_id):
    response = supabase.table(table_name).select('*').eq('id', record_id).execute()
    if response.error:
        raise Exception(response.error)
    return response.data[0] if response.data else None

def create_record(table_name, data):
    response = supabase.table(table_name).insert(data).execute()
    if response.error:
        raise Exception(response.error)
    return response.data[0]

def update_record(table_name, record_id, updates):
    response = supabase.table(table_name).update(updates).eq('id', record_id).execute()
    if response.error:
        raise Exception(response.error)
    return response.data[0]


def delete_record(table_name, record_id):
    response = supabase.table(table_name).delete().eq('id', record_id).execute()
    if response.error:
        raise Exception(response.error)
    return response.data[0]