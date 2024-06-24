/////////////////////////////////////////////////////////////
//
// pgAdmin 4 - PostgreSQL Tools
//
// Copyright (C) 2013 - 2023, The pgAdmin Development Team
// This software is released under the PostgreSQL Licence
//
//////////////////////////////////////////////////////////////

import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import gettext from 'sources/gettext';
import { Box, FormControl } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { InputText } from '../../FormComponents';
import { PgIconButton } from '../../Buttons';
import CloseIcon from '@mui/icons-material/CloseRounded';

const useStyles = makeStyles((theme)=>({
  root: {
    position: 'absolute',
    zIndex: 99,
    right: '4px',
    top: '0px',
    ...theme.mixins.panelBorder.all,
    borderTop: 'none',
    padding: '2px 4px',
    width: '250px',
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
}));

export default function GotoDialog({editor, show, onClose}) {
  const [gotoVal, setGotoVal] = useState('');
  const inputRef = useRef();
  const classes = useStyles();

  useEffect(()=>{
    if(show) {
      setGotoVal('');
      inputRef.current?.focus();
    }
  }, [show]);

  const onKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if(!/^[ ]*[1-9][0-9]*[ ]*(,[ ]*[1-9][0-9]*[ ]*){0,1}$/.test(gotoVal)) {
        return;
      }
      const v = gotoVal.split(',').map(Number);
      if(v.length == 1) {
        v.push(1);
      }
      editor.setCursor(v[0], v[1]-1);
      onClose();
    }
  };

  const onEscape = (e)=>{
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if(!editor) {
    return <></>;
  }

  return (
    <Box className={classes.root} style={{visibility: show ? 'visible' : 'hidden'}} tabIndex="0" onKeyDown={onEscape}>
      <div style={{whiteSpace: 'nowrap'}}>Ln [,Col]</div>
      <FormControl>
        <InputText
          value={gotoVal}
          inputRef={(ele)=>{inputRef.current = ele;}}
          onChange={(value)=>setGotoVal(value)}
          onKeyPress={onKeyPress}
        />
      </FormControl>
      <PgIconButton title={gettext('Close')} icon={<CloseIcon />} size="xs" noBorder onClick={onClose}/>
    </Box>
  );
}

GotoDialog.propTypes = {
  editor: PropTypes.object,
  show: PropTypes.bool,
  onClose: PropTypes.func,
};
