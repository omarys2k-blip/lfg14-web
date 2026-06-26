#!/usr/bin/env node
// LFG14 — Seed 32 participant accounts via Supabase Admin API
// Usage: SUPABASE_URL=https://xxx.supabase.co SUPABASE_SERVICE_KEY=your_key node seed-accounts.js

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY env vars')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

const accounts = [
  { email: 'lfg14.rapidwolf45@lfgchallenge.com',    password: 'gdct79!' },
  { email: 'lfg14.vitallion13@lfgchallenge.com',    password: 'cgpo93#' },
  { email: 'lfg14.vitalfalcon67@lfgchallenge.com',  password: 'pvau99@' },
  { email: 'lfg14.activebear29@lfgchallenge.com',   password: 'ftcj55@' },
  { email: 'lfg14.solidlion68@lfgchallenge.com',    password: 'nzjo90#' },
  { email: 'lfg14.strongpanther18@lfgchallenge.com',password: 'bfhc39!' },
  { email: 'lfg14.quickbear68@lfgchallenge.com',    password: 'qjjf44#' },
  { email: 'lfg14.boldshark78@lfgchallenge.com',    password: 'sejz91#' },
  { email: 'lfg14.fiercestorm17@lfgchallenge.com',  password: 'faig37#' },
  { email: 'lfg14.activepanther93@lfgchallenge.com',password: 'mxqd27!' },
  { email: 'lfg14.solidviper84@lfgchallenge.com',   password: 'kfzn21!' },
  { email: 'lfg14.rapideagle90@lfgchallenge.com',   password: 'erpk86@' },
  { email: 'lfg14.solidwolf97@lfgchallenge.com',    password: 'srng92@' },
  { email: 'lfg14.rapidcobra65@lfgchallenge.com',   password: 'eass74!' },
  { email: 'lfg14.rapidcobra91@lfgchallenge.com',   password: 'nfje77!' },
  { email: 'lfg14.activerhino12@lfgchallenge.com',  password: 'cjzu40!' },
  { email: 'lfg14.fiercehawk20@lfgchallenge.com',   password: 'tvzn26!' },
  { email: 'lfg14.leanshark43@lfgchallenge.com',    password: 'npzy98!' },
  { email: 'lfg14.sharptitan95@lfgchallenge.com',   password: 'qlnd38!' },
  { email: 'lfg14.activewolf85@lfgchallenge.com',   password: 'opas17!' },
  { email: 'lfg14.boldlion52@lfgchallenge.com',     password: 'bgrf26#' },
  { email: 'lfg14.leanfalcon70@lfgchallenge.com',   password: 'uecl64@' },
  { email: 'lfg14.steellion96@lfgchallenge.com',    password: 'qqbs23!' },
  { email: 'lfg14.apexpanther78@lfgchallenge.com',  password: 'lkhg19@' },
  { email: 'lfg14.rapidlion93@lfgchallenge.com',    password: 'zvzy40!' },
  { email: 'lfg14.vitalrhino71@lfgchallenge.com',   password: 'fkbj59@' },
  { email: 'lfg14.steelcobra64@lfgchallenge.com',   password: 'ssur72!' },
  { email: 'lfg14.apexcobra37@lfgchallenge.com',    password: 'zpot17!' },
  { email: 'lfg14.leanshark17@lfgchallenge.com',    password: 'ycep96!' },
  { email: 'lfg14.quicktiger82@lfgchallenge.com',   password: 'gpqk84#' },
  { email: 'lfg14.activebear36@lfgchallenge.com',   password: 'rigd92@' },
  { email: 'lfg14.steelstorm19@lfgchallenge.com',   password: 'aqoc78!' },
]

async function seed() {
  let created = 0
  let failed = 0

  for (const { email, password } of accounts) {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (error) {
      console.error(`FAIL  ${email}: ${error.message}`)
      failed++
    } else {
      console.log(`OK    ${email} (${data.user.id})`)
      created++
    }
  }

  console.log(`\nDone: ${created} created, ${failed} failed`)
}

seed()
