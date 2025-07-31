#!/bin/bash
cd /home/kavia/workspace/code-generation/manufacturing-time-calculator-111076-111086/frontend_app
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

