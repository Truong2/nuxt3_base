import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { randomBytes } from 'node:crypto'
if (existsSync('.env')) {
  console.log('.env đã tồn tại, giữ nguyên.')
} else {
  const value = readFileSync('.env.example', 'utf8').replace(
    'replace-this-with-a-random-secret-at-least-32-characters',
    randomBytes(48).toString('hex'),
  )
  writeFileSync('.env', value, { mode: 0o600 })
  console.log('Đã tạo .env local với session secret ngẫu nhiên.')
}
