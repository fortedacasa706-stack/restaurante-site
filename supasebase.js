import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://cbpqxhjsubhzulbjtpez.supabase.co';
const supabaseAnonKey = 'sb_publishable_BcLJ9OFt8E1Hfm2fBzj1uw_JoclLzHu';
const supabaseConfigured = supabaseUrl !== 'YOUR_SUPABASE_URL' && supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY';
const supabase = supabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;

async function saveReservation(reservation) {
    if (!supabaseConfigured) {
        throw new Error('Supabase não configurado');
    }
    const { data, error } = await supabase.from('reservations').insert([{ ...reservation, created_at: new Date().toISOString() }]);
    if (error) throw error;
    return data;
}

async function saveOrder(order) {
    if (!supabaseConfigured) {
        throw new Error('Supabase não configurado');
    }
    const { data, error } = await supabase.from('orders').insert([{ ...order, created_at: new Date().toISOString() }]);
    if (error) throw error;
    return data;
}

async function fetchRecentOrders(limitCount = 20) {
    if (!supabaseConfigured) {
        throw new Error('Supabase não configurado');
    }
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limitCount);
    if (error) throw error;
    return data;
}

async function fetchRecentReservations(limitCount = 20) {
    if (!supabaseConfigured) {
        throw new Error('Supabase não configurado');
    }
    const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limitCount);
    if (error) throw error;
    return data;
}

async function signInAdmin(email, password) {
    if (!supabaseConfigured) {
        throw new Error('Supabase não configurado');
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
}

async function logoutAdmin() {
    if (!supabaseConfigured) {
        throw new Error('Supabase não configurado');
    }
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

async function getCurrentUser() {
    if (!supabaseConfigured) {
        throw new Error('Supabase não configurado');
    }
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
}

function onAuthChange(callback) {
    if (!supabaseConfigured) {
        return () => {};
    }
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
        callback(session?.user ?? null);
    });
    return () => {
        listener?.subscription?.unsubscribe?.();
    };
}

export {
    supabaseConfigured,
    saveReservation,
    saveOrder,
    fetchRecentOrders,
    fetchRecentReservations,
    signInAdmin,
    logoutAdmin,
    getCurrentUser,
    onAuthChange
};
