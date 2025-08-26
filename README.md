# VoiceFlow CRM

Turn your voice notes into structured sales data, instantly.

## Features

- **AI Voice Transcription & Entity Extraction**: Automatically transcribe voice notes and extract key sales information (contacts, companies, deal stages, next steps)
- **Contextual Data Enrichment**: Add sentiment analysis and summaries to voice notes for better insights
- **Automated CRM Data Entry**: Sync extracted data directly to popular CRMs (HubSpot, Salesforce, Pipedrive)
- **Workflow Triggering & Task Management**: Automatically create follow-up tasks based on voice note content

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Database, Auth, Storage)
- **AI**: OpenAI (Whisper for transcription, GPT-4 for entity extraction)
- **CRM Integrations**: HubSpot, Salesforce, Pipedrive APIs

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase account and project
- An OpenAI API key
- CRM account(s) for testing integrations

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd voiceflow-crm
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Fill in your configuration:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
   - `VITE_OPENAI_API_KEY`: Your OpenAI API key

4. Set up Supabase database:
   
   Create the following tables in your Supabase dashboard:

   ```sql
   -- Users table (auto-created by Supabase Auth)
   
   -- Voice Notes table
   CREATE TABLE voice_notes (
     id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
     transcription_text text,
     extracted_entities jsonb,
     enriched_data jsonb,
     crm_sync_status text DEFAULT 'pending',
     sync_results jsonb,
     created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
     updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
   );

   -- CRM Integrations table
   CREATE TABLE crm_integrations (
     id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
     crm_type text NOT NULL,
     api_key text NOT NULL,
     settings jsonb DEFAULT '{}',
     is_active boolean DEFAULT true,
     created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
     updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
   );

   -- Enable Row Level Security
   ALTER TABLE voice_notes ENABLE ROW LEVEL SECURITY;
   ALTER TABLE crm_integrations ENABLE ROW LEVEL SECURITY;

   -- Create policies
   CREATE POLICY "Users can view own voice notes" ON voice_notes
     FOR SELECT USING (auth.uid() = user_id);
   
   CREATE POLICY "Users can insert own voice notes" ON voice_notes
     FOR INSERT WITH CHECK (auth.uid() = user_id);
   
   CREATE POLICY "Users can update own voice notes" ON voice_notes
     FOR UPDATE USING (auth.uid() = user_id);
   
   CREATE POLICY "Users can delete own voice notes" ON voice_notes
     FOR DELETE USING (auth.uid() = user_id);

   CREATE POLICY "Users can view own CRM integrations" ON crm_integrations
     FOR SELECT USING (auth.uid() = user_id);
   
   CREATE POLICY "Users can insert own CRM integrations" ON crm_integrations
     FOR INSERT WITH CHECK (auth.uid() = user_id);
   
   CREATE POLICY "Users can update own CRM integrations" ON crm_integrations
     FOR UPDATE USING (auth.uid() = user_id);
   
   CREATE POLICY "Users can delete own CRM integrations" ON crm_integrations
     FOR DELETE USING (auth.uid() = user_id);
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. **Sign Up/Login**: Create an account or sign in
2. **Connect CRM**: Go to Setup and connect your CRM(s)
3. **Record Voice Notes**: Use the voice recorder to capture sales conversations
4. **Review & Sync**: View transcribed notes with extracted entities and CRM sync status

## CRM Integration Setup

### HubSpot
1. Go to Settings → Integrations → API Key
2. Generate a new API key with contacts, companies, and deals permissions
3. Add the API key in VoiceFlow CRM setup

### Salesforce
1. Create a Connected App in Setup → App Manager
2. Configure OAuth 2.0 with appropriate scopes
3. Use the credentials in VoiceFlow CRM setup

### Pipedrive
1. Go to Settings → Personal → API
2. Generate a new API token
3. Add the token in VoiceFlow CRM setup

## Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React context providers
├── lib/               # Utility libraries and configurations
├── pages/             # Page components
├── services/          # API and business logic services
└── main.jsx          # Application entry point
```

## Key Components

- **VoiceRecorder**: Records audio and handles browser media APIs
- **TranscriptionDisplay**: Shows transcribed text and extracted entities
- **CRMConnectForm**: Handles CRM integration setup
- **StatusIndicator**: Shows sync status with visual feedback

## API Integrations

- **OpenAI Whisper**: Speech-to-text transcription
- **OpenAI GPT-4**: Entity extraction and data enrichment
- **Supabase**: Database, authentication, and real-time updates
- **CRM APIs**: Direct integration with HubSpot, Salesforce, and Pipedrive

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details