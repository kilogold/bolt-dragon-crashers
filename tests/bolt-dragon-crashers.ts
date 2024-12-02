import { PublicKey } from "@solana/web3.js";
import { Position } from "../target/types/position";
import { Movement } from "../target/types/movement";
import { Name } from "../target/types/name";
import { Readyness } from "../target/types/readyness";
import { Speed } from "../target/types/speed";
import { Health } from "../target/types/health";
import {
  InitializeNewWorld,
  AddEntity,
  InitializeComponent,
  ApplySystem,
} from "@magicblock-labs/bolt-sdk";
import { expect } from "chai";
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { CombatAction } from "../target/types/combat_action";
import { CombatTick } from "../target/types/combat_tick";
import { CombatInit } from "../target/types/combat_init";

// Add this helper function after imports and before describe
async function initializeCombatants(
  provider: anchor.AnchorProvider,
  worldPda: PublicKey,
  components: Program<any>[],
  name: string
): Promise<PublicKey> {
  // Create entity
  const entity = await AddEntity({
    payer: provider.wallet.publicKey,
    world: worldPda,
    connection: provider.connection,
  });
  await provider.sendAndConfirm(entity.transaction);

  // Initialize each component
  for (const component of components) {
    const componentInit = await InitializeComponent({
      payer: provider.wallet.publicKey,
      entity: entity.entityPda,
      componentId: component.programId,
    });
    await provider.sendAndConfirm(componentInit.transaction);
  }

  const combatInitSystem = anchor.workspace.CombatInit as Program<CombatInit>;
  const combatInit = await ApplySystem({
    authority: provider.wallet.publicKey,
    systemId: combatInitSystem.programId,
    world: worldPda,
    entities: [
      {
        entity: entity.entityPda,
        components: components.map((c) => ({ componentId: c.programId })),
      },
    ],
  });
  await provider.sendAndConfirm(combatInit.transaction);

  return entity.entityPda;
}

describe("bolt-dragon-crashers", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  // Constants used to test the program.
  let worldPda: PublicKey;
  let entityPda: PublicKey;
  let componentPda: PublicKey;
  let fighterPda: PublicKey;
  let dragonPda: PublicKey;

  const positionComponent = anchor.workspace.Position as Program<Position>;
  const systemMovement = anchor.workspace.Movement as Program<Movement>;
  const nameComponent = anchor.workspace.Name as Program<Name>;
  const readynessComponent = anchor.workspace.Readyness as Program<Readyness>;
  const speedComponent = anchor.workspace.Speed as Program<Speed>;
  const healthComponent = anchor.workspace.Health as Program<Health>;
  const combatActionSystem = anchor.workspace
    .CombatAction as Program<CombatAction>;
  const combatTickSystem = anchor.workspace.CombatTick as Program<CombatTick>;

  it("InitializeNewWorld", async () => {
    const initNewWorld = await InitializeNewWorld({
      payer: provider.wallet.publicKey,
      connection: provider.connection,
    });
    const txSign = await provider.sendAndConfirm(initNewWorld.transaction);
    worldPda = initNewWorld.worldPda;
    console.log(
      `Initialized a new world (ID=${worldPda}). Initialization signature: ${txSign}`
    );
  });

  it("Add an entity", async () => {
    const addEntity = await AddEntity({
      payer: provider.wallet.publicKey,
      world: worldPda,
      connection: provider.connection,
    });
    const txSign = await provider.sendAndConfirm(addEntity.transaction);
    entityPda = addEntity.entityPda;
    console.log(
      `Initialized a new Entity (ID=${addEntity.entityPda}). Initialization signature: ${txSign}`
    );
  });

  it("Add a component", async () => {
    const initializeComponent = await InitializeComponent({
      payer: provider.wallet.publicKey,
      entity: entityPda,
      componentId: positionComponent.programId,
    });
    const txSign = await provider.sendAndConfirm(
      initializeComponent.transaction
    );
    componentPda = initializeComponent.componentPda;
    console.log(
      `Initialized the grid component. Initialization signature: ${txSign}`
    );
  });

  it("Apply a system", async () => {
    // Check that the component has been initialized and x is 0
    const positionBefore = await positionComponent.account.position.fetch(
      componentPda
    );
    expect(positionBefore.x.toNumber()).to.equal(0);

    // Run the movement system
    const applySystem = await ApplySystem({
      authority: provider.wallet.publicKey,
      systemId: systemMovement.programId,
      world: worldPda,
      entities: [
        {
          entity: entityPda,
          components: [{ componentId: positionComponent.programId }],
        },
      ],
    });
    const txSign = await provider.sendAndConfirm(applySystem.transaction);
    console.log(`Applied a system. Signature: ${txSign}`);

    // Check that the system has been applied and x is > 0
    const positionAfter = await positionComponent.account.position.fetch(
      componentPda
    );
    expect(positionAfter.x.toNumber()).to.gt(0);
  });

  it("Create a combat scenario", async () => {
    // Initialize fighter with name and readyness components
    fighterPda = await initializeCombatants(
      provider,
      worldPda,
      [nameComponent, readynessComponent, speedComponent, healthComponent],
      "Fighter"
    );
    console.log(`Initialized fighter entity (ID=${fighterPda})`);

    // Initialize dragon with the same components
    dragonPda = await initializeCombatants(
      provider,
      worldPda,
      [nameComponent, readynessComponent, speedComponent, healthComponent],
      "Dragon"
    );
    console.log(`Initialized dragon entity (ID=${dragonPda})`);
  });

  it("Perpetually apply the combat systems", async function () {
    this.timeout(0); // Disable timeout for this test

    for (;;) {
      // Apply the combat tick system
      const tickSystem1 = await ApplySystem({
        authority: provider.wallet.publicKey,
        systemId: combatTickSystem.programId,
        world: worldPda,
        entities: [
          {
            entity: fighterPda,
            components: [
              { componentId: speedComponent.programId },
              { componentId: readynessComponent.programId },
              { componentId: nameComponent.programId },
            ],
          },
        ],
      });
      const txSignTick = await provider.sendAndConfirm(tickSystem1.transaction);
      console.log(`Applied a system. Signature: ${txSignTick}`);

      const tickSystem2 = await ApplySystem({
        authority: provider.wallet.publicKey,
        systemId: combatTickSystem.programId,
        world: worldPda,
        entities: [
          {
            entity: dragonPda,
            components: [
              { componentId: speedComponent.programId },
              { componentId: readynessComponent.programId },
              { componentId: nameComponent.programId },
            ],
          },
        ],
      });
      const txSignTick2 = await provider.sendAndConfirm(
        tickSystem2.transaction
      );
      console.log(`Applied a system. Signature: ${txSignTick2}`);

      // Apply the combat action system
      const actionSystem = await ApplySystem({
        authority: provider.wallet.publicKey,
        systemId: combatActionSystem.programId,
        world: worldPda,
        entities: [
          {
            entity: fighterPda,
            components: [
              { componentId: readynessComponent.programId },
              { componentId: nameComponent.programId },
            ],
          },
        ],
      });
      const txSignAction = await provider.sendAndConfirm(
        actionSystem.transaction
      );
      console.log(`Applied a system. Signature: ${txSignAction}`);

      const actionSystem2 = await ApplySystem({
        authority: provider.wallet.publicKey,
        systemId: combatActionSystem.programId,
        world: worldPda,
        entities: [
          {
            entity: dragonPda,
            components: [
              { componentId: readynessComponent.programId },
              { componentId: nameComponent.programId },
            ],
          },
        ],
      });
      const txSignAction2 = await provider.sendAndConfirm(
        actionSystem2.transaction
      );
      console.log(`Applied a system. Signature: ${txSignAction2}`);

      // Introduce a 400 ms delay
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
  });
});
