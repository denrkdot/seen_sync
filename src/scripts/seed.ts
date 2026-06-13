/**
 * Seed script — run with:
 * npx ts-node --compiler-options '{"module":"CommonJS"}' src/scripts/seed.ts
 *
 * Seeds:
 * - Team: "Design Team" code: "DEMO01"
 * - Members: Jan (😊 Good), Maria (😤 Frustrated + blocker), Carlo (😴 Tired), Sofia (pending)
 * - 5 days of history with varied moods and 2 blocker entries
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
 */

import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { format, subDays } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const db = createClient(supabaseUrl, supabaseAnonKey);

function getPHTDate(daysAgo = 0): string {
  const now = new Date();
  const d = subDays(now, daysAgo);
  const pht = toZonedTime(d, 'Asia/Manila');
  return format(pht, 'yyyy-MM-dd');
}

async function seed() {
  console.log('🌱 Starting seed...');

  // Upsert team
  const { data: existingTeam } = await db
    .from('teams')
    .select('id')
    .eq('code', 'DEMO01')
    .maybeSingle();

  let teamId: string;

  if (existingTeam) {
    teamId = existingTeam.id as string;
    console.log('✓ Team DEMO01 already exists, skipping...');
  } else {
    const { data: team, error: teamErr } = await db
      .from('teams')
      .insert({ name: 'Design Team', code: 'DEMO01' })
      .select()
      .single();
    if (teamErr || !team) {
      console.error('❌ Failed to create team:', teamErr);
      process.exit(1);
    }
    teamId = team.id as string;
    console.log('✓ Created team DEMO01');
  }

  // Create members
  const memberDefs = [
    { name: 'Jan Reyes' },
    { name: 'Maria Santos' },
    { name: 'Carlo Mendez' },
    { name: 'Sofia Dela Cruz' }, // will be left pending for today
  ];

  const memberIds: Record<string, string> = {};
  for (const m of memberDefs) {
    const { data: existing } = await db
      .from('members')
      .select('id')
      .eq('team_id', teamId)
      .eq('name', m.name)
      .maybeSingle();
    if (existing) {
      memberIds[m.name] = existing.id as string;
      console.log(`✓ Member ${m.name} already exists`);
    } else {
      const { data: member, error } = await db
        .from('members')
        .insert({ team_id: teamId, name: m.name })
        .select()
        .single();
      if (error || !member) {
        console.error(`❌ Failed to create member ${m.name}:`, error);
        continue;
      }
      memberIds[m.name] = member.id as string;
      console.log(`✓ Created member: ${m.name}`);
    }
  }

  // Standup data for past 5 days (not today — leaves today fresh for demo)
  const standups = [
    // 1 day ago
    {
      member: 'Jan Reyes', daysAgo: 1,
      mood: '😊', finished: 'Reviewed and merged the homepage redesign PR.',
      today: 'Writing documentation for the onboarding flow.',
      blocker: null,
    },
    {
      member: 'Maria Santos', daysAgo: 1,
      mood: '😤', finished: 'Spent 3 hours debugging a CSS layout issue.',
      today: 'Fixing the mobile navigation component.',
      blocker: 'Waiting on design approval for the new button styles.',
    },
    {
      member: 'Carlo Mendez', daysAgo: 1,
      mood: '😴', finished: 'Set up the Storybook environment.',
      today: 'Adding component stories for the card system.',
      blocker: null,
    },
    // 2 days ago
    {
      member: 'Jan Reyes', daysAgo: 2,
      mood: '🔥', finished: 'Shipped the new landing page to staging.',
      today: 'Code review for Maria\'s PR and fixing CI failures.',
      blocker: null,
    },
    {
      member: 'Maria Santos', daysAgo: 2,
      mood: '😊', finished: 'Completed the icon audit across all screens.',
      today: 'Starting the homepage hero redesign.',
      blocker: null,
    },
    {
      member: 'Carlo Mendez', daysAgo: 2,
      mood: '😐', finished: 'Updated dependencies, fixed 3 security warnings.',
      today: 'Setting up Storybook and component documentation.',
      blocker: 'Need access to the Figma workspace to reference designs.',
    },
    // 3 days ago
    {
      member: 'Jan Reyes', daysAgo: 3,
      mood: '😊', finished: 'Finished the API integration for team creation.',
      today: 'Working on the board polling logic.',
      blocker: null,
    },
    {
      member: 'Sofia Dela Cruz', daysAgo: 3,
      mood: '😊', finished: 'Onboarded to the project and reviewed codebase.',
      today: 'Picking up the first ticket — blockers feed component.',
      blocker: null,
    },
    // 4 days ago
    {
      member: 'Jan Reyes', daysAgo: 4,
      mood: '🔥', finished: 'Set up the Supabase schema and initial API routes.',
      today: 'Building the team creation flow.',
      blocker: null,
    },
    // 5 days ago
    {
      member: 'Jan Reyes', daysAgo: 5,
      mood: '😊', finished: 'Bootstrapped the Next.js project with Tailwind and shadcn.',
      today: 'Setting up the Supabase schema.',
      blocker: null,
    },
  ];

  let inserted = 0;
  let skipped = 0;
  for (const s of standups) {
    const memberId = memberIds[s.member];
    if (!memberId) { console.warn(`⚠ No member ID for ${s.member}`); continue; }
    const date = getPHTDate(s.daysAgo);

    const { data: existing } = await db
      .from('standups')
      .select('id')
      .eq('member_id', memberId)
      .eq('date', date)
      .maybeSingle();

    if (existing) { skipped++; continue; }

    const { error } = await db.from('standups').insert({
      team_id: teamId,
      member_id: memberId,
      member_name: s.member,
      mood: s.mood,
      finished: s.finished,
      today: s.today,
      blocker: s.blocker,
      date,
    });

    if (error) {
      console.error(`❌ Failed to insert standup for ${s.member} on ${date}:`, error);
    } else {
      inserted++;
    }
  }

  console.log(`\n✅ Seed complete!`);
  console.log(`   Team: DEMO01 (${teamId})`);
  console.log(`   Members: ${Object.keys(memberIds).join(', ')}`);
  console.log(`   Standups: ${inserted} inserted, ${skipped} already existed`);
  console.log(`\n   Visit: http://localhost:3000/team/DEMO01`);
}

seed().catch(err => {
  console.error('Fatal error during seed:', err);
  process.exit(1);
});
