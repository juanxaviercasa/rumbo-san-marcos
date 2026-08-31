# Supabase migration for Rumbo San Marcos

## 1. Create project

Create a new Supabase project in the Supabase dashboard.

## 2. Apply schema

Open SQL Editor in Supabase and run the contents of `supabase/schema.sql`.

## 3. Environment variables

Create a `.env.local` in `frontend` with:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 4. Migration notes

- Replace PocketBase calls with Supabase client calls.
- Keep the current frontend logic for report generation and study recommendations.
- Use the SQL trigger to compute score, referential_score, and gap automatically when status is `submitted`.
- For WhatsApp delivery, use a Supabase Edge Function and Twilio.

## 5. Optional next step

Add a `report_delivery` table or use an Edge Function to send report text via WhatsApp or email.
