import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const hubs = [
  {
    name:    "Durham Library Hub",
    address: "300 N Roxboro St",
    city:    "Durham",
    state:   "NC",
    zip:     "27701",
    notes:   "Walk-ins welcome. Main branch during open hours.",
    schedules: [
      { dayOfWeek: 2, startTime: "10:00", endTime: "13:00", cadence: "Weekly", isActive: true },
      { dayOfWeek: 4, startTime: "14:00", endTime: "17:00", cadence: "Weekly", isActive: true },
    ],
  },
  {
    name:    "Raleigh Digital Impact Hub",
    address: "501 S Person St",
    city:    "Raleigh",
    state:   "NC",
    zip:     "27601",
    notes:   "City of Raleigh Digital Impact Program. SE Raleigh community center.",
    schedules: [
      { dayOfWeek: 1, startTime: "09:00", endTime: "12:00", cadence: "Weekly", isActive: true },
      { dayOfWeek: 3, startTime: "13:00", endTime: "16:00", cadence: "Weekly", isActive: true },
    ],
  },
];

async function main() {
  for (const hub of hubs) {
    const created = await prisma.hubLocation.upsert({
      where:  { name: hub.name },
      update: { address: hub.address, city: hub.city, state: hub.state, zip: hub.zip, notes: hub.notes },
      create: { name: hub.name, address: hub.address, city: hub.city, state: hub.state, zip: hub.zip, notes: hub.notes },
    });

    for (const s of hub.schedules) {
      const stableId = `${created.id}-${s.dayOfWeek}-${s.startTime}-${s.endTime}`;
      await prisma.hubSchedule.upsert({
        where:  { id: stableId },
        update: { cadence: s.cadence, isActive: s.isActive },
        create: {
          id:            stableId,
          hubLocationId: created.id,
          dayOfWeek:     s.dayOfWeek,
          startTime:     s.startTime,
          endTime:       s.endTime,
          cadence:       s.cadence,
          isActive:      s.isActive,
        },
      });
    }

    console.log(`✓ ${hub.name} (${created.id})`);
  }
}

main()
  .then(async () => { await prisma.$disconnect(); console.log("Seed complete."); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
