import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import LogItem from './LogItem';
import AddLogItem from './AddLogItem';
import { ipcRenderer } from 'electron';

const App = () => {
  const [logs, setLogs] = useState([]);

  const [alert, setAlert] = useState({
    show: false,
    message: '',
    variant: 'success',
  });

  useEffect(() => {
    ipcRenderer.send('logs:load');

    ipcRenderer.on('logs:get', (e, logs) => {
      setLogs(JSON.parse(logs));
    });

    ipcRenderer.on('logs:clear', (e) => {
      setLogs([]);
      showAlert('Logs cleared');
    });
  }, []);

  function addItem(item) {
    if (item.text === '' || item.user === '' || item.priority === '') {
      showAlert('Please enter all fields', 'danger');
      return;
    }
    // item._id = Math.floor(Math.random() * 90000) + 10000;
    // item.created = new Date().toString();
    // setLogs([...logs, item]);

    ipcRenderer.send('logs:add', item);

    showAlert('Log added');
  }

  function deleteItem(_id) {
    // setLogs(logs.filter((item) => {return item._id !== _id;}));
    ipcRenderer.send('logs:delete', _id);
    showAlert('Log removed');
  }

  function showAlert(message, variant = 'success', mseconds = 3000) {
    setAlert({
      show: true,
      message: message,
      variant: variant,
    });

    setTimeout(() => {
      setAlert({
        show: false,
        message: '',
        variant: 'success',
      });
    }, mseconds);
  }

  return (
    <Container>
      <AddLogItem addItem={addItem}></AddLogItem>
      {alert.show && <Alert variant={alert.variant}>{alert.message}</Alert>}
      <Table>
        <thead>
          <tr>
            <th>Priority</th>
            <th>Log Text</th>
            <th>User</th>
            <th>Created</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => {
            return <LogItem key={log._id} log={log} deleteItem={deleteItem} />;
          })}
        </tbody>
      </Table>
    </Container>
  );
};

export default App;
