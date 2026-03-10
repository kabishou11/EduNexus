#!/usr/bin/env node

/**
 * Generate VAPID keys for Web Push notifications
 * Run: node scripts/generate-vapid-keys.mjs
 */

import webpush from 'web-push';

console.log('Generating VAPID keys for Web Push...\n');

const vapidKeys = webpush.generateVAPIDKeys();

console.log('Public Key:');
console.log(vapidKeys.publicKey);
console.log('\nPrivate Key:');
console.log(vapidKeys.privateKey);

console.log('\n\nAdd these to your .env.local file:');
console.log('----------------------------------------');
console.log(`NEXT_PUBLIC_VAPID_PUBLIC_KEY=${vapidKeys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${vapidKeys.privateKey}`);
console.log('----------------------------------------\n');
