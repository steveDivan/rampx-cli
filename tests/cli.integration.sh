#!/usr/bin/env bash
set -euo pipefail

# ANSI Color formatting
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Test Runner Helpers
assert_success() {
  local cmd="$1"
  local msg="$2"
  if eval "$cmd"; then
    echo -e "${GREEN}✓ PASS:${NC} $msg"
  else
    echo -e "${RED}✗ FAIL:${NC} $msg"
    exit 1
  fi
}

assert_exit_code() {
  local expected_code="$1"
  local cmd="$2"
  local msg="$3"
  set +e
  eval "$cmd" > /dev/null 2>&1
  local actual_code=$?
  set -e
  if [ "$actual_code" -eq "$expected_code" ]; then
    echo -e "${GREEN}✓ PASS:${NC} $msg (Exit Code $actual_code)"
  else
    echo -e "${RED}✗ FAIL:${NC} $msg (Expected $expected_code, got $actual_code)"
    exit 1
  fi
}

# Create an isolated temporary directory for testing
WORK_DIR=$(mktemp -d)
trap 'rm -rf "$WORK_DIR"' EXIT
cd "$WORK_DIR"

echo "=== Running RampX CLI Integration Test Suite ==="

# 1. Test Flag-Based Execution (Non-Interactive)
assert_success "rpx init -n test_flutter_app -f flutter -p clean --yes" \
  "Scaffolds Flutter project non-interactively using flags"

# 2. Verify Scaffolding Folder Structure
test -d "test_flutter_app/lib/domain" || { echo "Missing lib/domain folder"; exit 1; }
test -d "test_flutter_app/lib/data" || { echo "Missing lib/data folder"; exit 1; }
test -d "test_flutter_app/lib/presentation" || { echo "Missing lib/presentation folder"; exit 1; }
test -f "test_flutter_app/README.md" || { echo "Missing README.md"; exit 1; }
echo -e "${GREEN}✓ PASS:${NC} Folder scaffolding matches Clean Architecture layout"

# 3. Test Invalid Input Flags (Error Handling & Exit Codes)
assert_exit_code 1 "rpx init -n invalid_app -f unknown_framework --yes" \
  "Rejects invalid framework flag with Exit Code 1"

assert_exit_code 1 "rpx init -n test_flutter_app -f flutter --no-overwrite" \
  "Prevents overwriting existing directory with Exit Code 1"

# 4. Test Sub-module Generation inside Existing Project
cd test_flutter_app
assert_success "rpx g feature auth" \
  "Generates standalone feature module within existing workspace"

test -d "lib/presentation/auth" || { echo "Missing feature module folder"; exit 1; }
echo -e "${GREEN}✓ PASS:${NC} Granular module generation succeeded"

echo -e "\n${GREEN}All CLI integration tests passed!${NC}"