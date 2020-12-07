import * as constants from "./constants";
import * as errors from "./errors";
import * as charUtil from "./char_util";

/* checkDNS returns if a given value is a conformant DNS_LABEL.
See: https://www.ietf.org/rfc/rfc952.txt and https://www.ietf.org/rfc/rfc1123.txt (2.1) for more information.

Snippet from RFC952:

    1. A "name" (Net, Host, Gateway, or Domain name) is a text string up
    to 24 characters drawn from the alphabet (A-Z), digits (0-9), minus
    sign (-), and period (.).  Note that periods are only allowed when
    they serve to delimit components of "domain style names". (See
    RFC-921, "Domain Name System Implementation Schedule", for
    background).  No blank or space characters are permitted as part of a
    name. No distinction is made between upper and lower case.  The first
    character must be an alpha character.  The last character must not be
    a minus sign or period.  A host which serves as a GATEWAY should have
    "-GATEWAY" or "-GW" as part of its name.  Hosts which do not serve as
    Internet gateways should not use "-GATEWAY" and "-GW" as part of
    their names. A host which is a TAC should have "-TAC" as the last
    part of its host name, if it is a DoD host.  Single character names
    or nicknames are not allowed.
*/
function checkDNS(value: string): Error | null {
  const valueLen = value.length;
  if (valueLen == 0) {
    return errors.ErrKeyDNSPrefixEmpty;
  }
  if (valueLen > constants.MaxDNSPrefixLen) {
    return errors.ErrKeyDNSPrefixTooLong;
  }

  const statePrefixSuffix = 0;
  const stateAlpha = 1;
  const stateDotDash = 2;

  let state = 0;
  let ch = "";
  for (let pos = 0; pos < valueLen; pos++) {
    ch = value.charAt(pos);
    switch (state) {
      case statePrefixSuffix: //check prefix | suffix
        if (!charUtil.isLowerAlpha(ch)) {
          return errors.ErrKeyInvalidCharacter;
        }

        state = stateAlpha;
        continue;
        0;
      case stateAlpha:
        if (ch == constants.Dot || ch == constants.Dash) {
          state = stateDotDash;
          continue;
        }
        if (!charUtil.isLowerAlpha(ch)) {
          return errors.ErrKeyInvalidCharacter;
        }
        if (pos === valueLen - 2) {
          state = statePrefixSuffix;
          continue;
        }
        continue;

      case stateDotDash: // we've hit a dot, dash, or underscore that can't repeat
        if (charUtil.isLowerAlpha(ch)) {
          state = stateAlpha;
          continue;
        }
        return errors.ErrKeyInvalidCharacter;
    }
  }
  return null;
}

export { checkDNS };
