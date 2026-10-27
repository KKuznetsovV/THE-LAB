import bcrypt from 'bcryptjs';
import config from 'config';
import Admin from '../models/Admin';

export async function seedOwnerIfEmpty(): Promise<void> {
  const existing = await Admin.count();
  if (existing > 0) return;
  const email = config.get<string>('app.adminEmail').trim().toLowerCase();
  const password = config.get<string>('app.adminPassword');
  if (!email || !password) return;
  if (password.length < 12) {
    console.error('Skipping admin seed: THELAB_ADMIN_PASSWORD must be at least 12 characters');
    return;
  }
  const passwordHash = await bcrypt.hash(password, 12);
  await Admin.create({ email, name: 'Owner', passwordHash, role: 'owner', isActive: true });
  console.log(`Seeded owner ${email}`);
}
