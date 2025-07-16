import React from 'react';
import PropTypes from 'prop-types';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import styled from 'styled-components';

// Styled components with refined alignment and softer shadow
const Card = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  max-width: 480px;
  margin: 20px auto;
  height: 200px; /* adjust as needed */
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => (props.success ? '#28a745' : '#dc3545')};
`;

const Title = styled.h2`
  margin: 0 0 0 10px;
  font-size: 1.5rem;
  font-weight: 600;
`;

const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
`;

const Message = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  text-align: center;
`;

const Badges = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 12px;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  background: #f1f3f5;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 0.875rem;
  font-weight: 500;
`;

const ErrorBlock = styled.pre`
  background: #fff5f5;
  border: 1px solid #f5c2c7;
  color: #842029;
  border-radius: 8px;
  padding: 12px;
  overflow-x: auto;
  font-family: monospace;
  font-size: 0.9rem;
`;

/**
 * Result Component
 * @param {Object} props
 * @param {Object} props.result - JSON response from code execution
 */
const Result = ({ result }) => {
  const { stdout, time, memory, stderr, compile_output, message, status } = result;
  const isSuccess = status && (status.id === 3 || status.description === 'Accepted');
  const errorMsg = stderr || compile_output || message || "An unknown error occurred.";

  return (
    <Card>
      <Header success={isSuccess}>
        {isSuccess ? <FaCheckCircle size={28} /> : <FaTimesCircle size={28} />}
        <Title>{isSuccess ? 'Accepted' : 'Error'}</Title>
      </Header>
      <Body>
        {isSuccess ? (
          <>
            <Message>{stdout ? stdout.trim() : 'All tests passed.'}</Message>
            <Badges>
              <Badge>⏱ {time}s</Badge>
              <Badge>💾 {memory} KB</Badge>
            </Badges>
          </>
        ) : (
          <ErrorBlock>{errorMsg}</ErrorBlock>
        )}
      </Body>
    </Card>
  );
};

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

export default Result;
