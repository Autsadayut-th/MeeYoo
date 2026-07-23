-- Initial Seed Data for MeeYoo
-- Insert demo household and items for testing
INSERT INTO public.homes (id, name, invite_code) 
VALUES ('h8829000-0000-0000-0000-000000000000', 'บ้านของเรา 🏡', 'HOME-8829')
ON CONFLICT (invite_code) DO NOTHING;
