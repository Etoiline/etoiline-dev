import assert from 'node:assert/strict'
import { test } from 'node:test'
import { parseContactMessage } from '../shared/contact.ts'

const validMessage = {
  name: 'Camille',
  email: 'camille@example.com',
  message: 'Bonjour, parlons de mon projet.',
  website: '',
}

test('le nom accepte de 2 à 100 caractères, bornes incluses', () => {
  const shortest = { ...validMessage, name: 'Zo' }
  const longest = { ...validMessage, name: 'a'.repeat(100) }

  assert.equal(parseContactMessage({ ...validMessage, name: 'Z' }), null)
  assert.deepEqual(parseContactMessage(shortest), shortest)
  assert.deepEqual(parseContactMessage(longest), longest)
  assert.equal(parseContactMessage({ ...validMessage, name: 'a'.repeat(101) }), null)
})

test('l’adresse e-mail accepte 254 caractères et en rejette 255', () => {
  // Des segments de taille valide isolent la limite de longueur de l’adresse entière.
  const localPart = 'a'.repeat(64)
  const domain = ['b'.repeat(63), 'c'.repeat(63), 'd'.repeat(58), 'fr'].join('.')
  const longest = { ...validMessage, email: `${localPart}@${domain}` }

  assert.equal(longest.email.length, 254)
  assert.deepEqual(parseContactMessage(longest), longest)
  assert.equal(parseContactMessage({ ...longest, email: `${longest.email}x` }), null)
})

test('le message accepte de 10 à 5 000 caractères, bornes incluses', () => {
  const shortest = { ...validMessage, message: 'a'.repeat(10) }
  const longest = { ...validMessage, message: 'a'.repeat(5_000) }

  assert.equal(parseContactMessage({ ...validMessage, message: 'a'.repeat(9) }), null)
  assert.deepEqual(parseContactMessage(shortest), shortest)
  assert.deepEqual(parseContactMessage(longest), longest)
  assert.equal(parseContactMessage({ ...validMessage, message: 'a'.repeat(5_001) }), null)
})

test('la longueur est mesurée après suppression des espaces périphériques', () => {
  const message = { ...validMessage, name: 'Zo', message: 'a'.repeat(5_000) }
  const padded = { ...message, name: ' Zo ', message: ` ${message.message} ` }

  assert.deepEqual(parseContactMessage(padded), message)
  assert.equal(parseContactMessage({ ...padded, name: ' Z ' }), null)
})
