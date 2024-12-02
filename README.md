Testing out [MagicBlock's Bolt](https://github.com/magicblock-labs/bolt).

This project simulates a fighter and a dragon getting ready for combat.
The programs use logging for development purposes. 
When running `bolt test`, the final test will run indefinitely to simulate a game loop.

Use a separate terminal to run:  
`tail -f .anchor/program-logs/HyEV1NvAifHHcUjUvWEEiHwHDNEv72zzoc5JSdz3LTQv.combat_tick.log | grep -E "combat|strike"`

You shoul see similar output:
```
    Program log: Fighter is preparing for combat...
    Program log: Dragon is preparing for combat...
    Program log: Fighter is preparing for combat...
    Program log: Dragon is preparing for combat...
    Program log: Fighter is ready to strike!
    Program log: Dragon is ready to strike!
    Program log: Fighter is preparing for combat...
    Program log: Dragon is preparing for combat...
    Program log: Fighter is preparing for combat...
    Program log: Dragon is preparing for combat...
    Program log: Fighter is preparing for combat...
    Program log: Dragon is preparing for combat...
    Program log: Fighter is preparing for combat...
    Program log: Dragon is preparing for combat...
    Program log: Fighter is preparing for combat...
    Program log: Dragon is preparing for combat...
    Program log: Fighter is preparing for combat...
    Program log: Dragon is preparing for combat...
    Program log: Fighter is preparing for combat...
    Program log: Dragon is preparing for combat...
    Program log: Fighter is ready to strike!
    Program log: Dragon is ready to strike!
```
