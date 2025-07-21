/**
 * src/components/Result.jsx
 *
 * Renders code execution outcomes for practice submissions:
 * - Displays an icon and title indicating success (Accepted) or failure (Error).
 * - On success, shows the output, execution time, and memory usage badges.
 * - On error, shows the relevant error message in a styled code block.
 *
 * Helper Functions:
 *   - evaluateStatus(result): boolean   // determines if result is accepted
 *   - extractErrorMessage(result): string // selects appropriate error message
 *
 * @author bbansal-18
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import styled from 'styled-components';

// Styled container for the result card
const Card = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 20px auto;
`;

// Header section with status icon and title
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => (props.success ? '#28a745' : '#dc3545')};
`;

// Title text for status
const Title = styled.h2`
  margin: 0 0 0 10px;
  font-size: 1.5rem;
  font-weight: 600;
`;

// Body area for message or error block
const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
`;

// Standard paragraph message styling
const Message = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  text-align: center;
`;

// Container for status badges (time and memory)
const Badges = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 12px;
`;

// Individual badge styling
const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  background: #f1f3f5;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 0.875rem;
  font-weight: 500;
`;

// Styled block for error messages
const ErrorBlock = styled.pre`
  background: #fff5f5;
  border: 1px solid #f5c2c7;
  color: #842029;
  border-radius: 8px;
  padding: 12px;
  font-family: monospace;
  font-size: 0.9rem;
`;

/**
 * Determine if the given result indicates a successful execution.
 *
 * @param {Object} result          - Execution result object
 * @param {Object} result.status   - Status with id and description
 * @returns {boolean}              - True if accepted, false otherwise
 */
function evaluateStatus(result) {
  const { status } = result;
  return status?.id === 3 || status?.description === 'Accepted';
}

/**
 * Extract the primary error message from a failed result.
 *
 * @param {Object} result                 - Execution result object
 * @param {string} [result.stderr]        - Runtime error output
 * @param {string} [result.compile_output]- Compilation error output
 * @param {string} [result.message]       - Generic error message
 * @returns {string}                      - First non-empty error string or fallback text
 */
function extractErrorMessage({ stderr, compile_output, message }) {
  return stderr || compile_output || message || 'An unknown error occurred.';
}

/**
 * Result Component
 *
 * Renders the UI card for code execution results.
 *
 * @param {Object} props
 * @param {Object} props.result - JSON response from code execution API
 * @returns {JSX.Element}       - Rendered result component
 */
export default function Result({ result }) {
  const isSuccess = evaluateStatus(result);
  const errorMsg = extractErrorMessage(result);

  return (
    <Card>
      <Header success={isSuccess}>
        {isSuccess ? <FaCheckCircle size={28} /> : <FaTimesCircle size={28} />}
        <Title>{isSuccess ? 'Accepted' : 'Error'}</Title>
      </Header>
      <Body>
        {isSuccess ? (
          <>
            <Message>{result.stdout?.trim() || 'All tests passed.'}</Message>
            <Badges>
              <Badge>⏱ {result.time}s</Badge>
              <Badge>💾 {result.memory} KB</Badge>
            </Badges>
          </>
        ) : (
          <ErrorBlock>{errorMsg}</ErrorBlock>
        )}
      </Body>
    </Card>
  );
}

Result.propTypes = {
  result: PropTypes.shape({
    stdout: PropTypes.string,
    time: PropTypes.string.isRequired,
    memory: PropTypes.number.isRequired,
    stderr: PropTypes.string,
    compile_output: PropTypes.string,
    message: PropTypes.string,
    status: PropTypes.shape({
      id: PropTypes.number.isRequired,
      description: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
