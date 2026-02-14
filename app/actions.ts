'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addBookmark(formData: FormData) {
    const supabase = await createClient()

    const title = formData.get('title') as string
    const url = formData.get('url') as string
    const summary = formData.get('summary') as string

    if (!title || !url) {
        return { error: 'Msg: Title and URL are required' }
    }

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Msg: User not authenticated' }
    }

    const { error } = await supabase.from('bookmarks').insert({
        title,
        url,
        summary: summary || null,
        user_id: user.id,
    })

    if (error) {
        console.error('Error adding bookmark:', error)
        return { error: 'Msg: Failed to add bookmark' }
    }

    revalidatePath('/dashboard')
    return { success: true }
}

export async function deleteBookmark(id: string) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Msg: User not authenticated' }
    }

    const { error } = await supabase.from('bookmarks').delete().eq('id', id)

    if (error) {
        console.error('Error deleting bookmark:', error)
        return { error: 'Msg: Failed to delete bookmark' }
    }

    revalidatePath('/dashboard')
    return { success: true }
}
