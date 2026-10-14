import { describe, expect, test } from "bun:test";
import { listReplicaSkills, readReplicaSkill, replicaSkillIds } from "../src/skills";

describe("Replica skill pack", () => {
  test("exposes the complete ordered workflow", async () => {
    const skills = await listReplicaSkills();
    expect(skills.map(({ id }) => id)).toEqual([...replicaSkillIds]);
    expect(skills.every(({ description }) => description.length > 20)).toBeTrue();
  });

  test("reads a skill by full name or short alias", async () => {
    expect(await readReplicaSkill("replica-recon")).toContain("# replica-recon");
    expect(await readReplicaSkill("recon")).toContain("# replica-recon");
  });

  test("rejects unknown skills", async () => {
    expect(readReplicaSkill("missing")).rejects.toThrow("unknown Replica skill");
  });
});
