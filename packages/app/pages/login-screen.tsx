// Example usage in a file like: packages/app/src/components/LoginScreen.tsx

import { supabase } from '@finlite-app-personal/core/src/lib/supabase';

// Now you can use the client with full autocompletion!
const fetchUserData = async () => {
  const { data, error } = await supabase
    .from('users') // <-- will autocomplete table names
    .select('*'); // <-- will autocomplete column names

  if (error) console.error('Error fetching user data:', error);
  else console.log('User data:', data);
};