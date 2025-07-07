import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { secret_number } = await req.json();

    if (!secret_number) {
      return new Response(JSON.stringify({ error: 'Secret number is required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Create a Supabase client with the service role key
    // This client has admin privileges and can bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Find the member by secret number
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, name, email, role, is_active')
      .eq('secret_number', secret_number)
      .eq('role', 'member')
      .eq('is_active', true)
      .single();

    if (profileError || !profile) {
      console.error('Profile not found or inactive:', profileError?.message || 'No profile');
      return new Response(JSON.stringify({ error: 'Invalid secret number or inactive account' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    // Generate a session for the found user
    // This uses generateLink with type 'magiclink' to create a session for an existing user.
    // The redirectTo is important to ensure the session is properly set on the client side.
    const { data: { user, session }, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: profile.email,
      redirectTo: 'https://86a6094d-c758-4efa-9688-890a8a54f068.lovableproject.com/login' // Your app's login URL
    });

    if (sessionError || !session) {
      console.error('Error generating session link:', sessionError?.message);
      return new Response(JSON.stringify({ error: 'Failed to generate user session' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // Return the session data to the client
    return new Response(JSON.stringify({
      user_id: profile.id,
      user_name: profile.name,
      user_role: profile.role,
      is_active: profile.is_active,
      session: session, // Send the full session object
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Edge Function error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});