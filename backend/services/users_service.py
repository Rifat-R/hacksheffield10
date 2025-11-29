from supabase_client import supabase

def get_users():
    response = supabase.table('users').select('*').execute()
    if response.error:
        raise Exception(response.error)
    return response.data

def get_user_by_id(user_id):
    response = supabase.table('users').select('*').eq('id', user_id).execute()
    if response.error:
        raise Exception(response.error)
    return response.data[0] if response.data else None

def create_user(user):
    response = supabase.table('users').insert(user).execute()
    if response.error:
        raise Exception(response.error)
    return response.data[0]

def update_user(user_id, updates):
    response = supabase.table('users').update(updates).eq('id', user_id).execute()
    if response.error:
        raise Exception(response.error)
    return response.data[0]


def delete_user(user_id):
    response = supabase.table('users').delete().eq('id', user_id).execute()
    if response.error:
        raise Exception(response.error)
    return response.data[0]