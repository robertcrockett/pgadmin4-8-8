/////////////////////////////////////////////////////////////
//
// pgAdmin 4 - PostgreSQL Tools
//
// Copyright (C) 2013 - 2024, The pgAdmin Development Team
// This software is released under the PostgreSQL Licence
//
//////////////////////////////////////////////////////////////
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useState, useEffect } from 'react';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import CommentIcon from '@mui/icons-material/Comment';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import { usePgAdmin } from '../../../static/js/BrowserComponent';
import usePreferences from '../../../preferences/static/js/store';

const useStyles = makeStyles((theme)=>({
  root: {
    position: 'absolute',
    bottom: 0,
    width: 'auto',
    maxWidth: '99%',
    zIndex: 1004,
    padding: '0.25rem 0.5rem',
    fontSize: '0.95em',
    color: theme.palette.background.default,
    backgroundColor: theme.palette.text.primary,
    borderTopRightRadius: theme.shape.borderRadius,
  },
  row: {
    display: 'flex',
    alignItems: 'center'
  },
  overflow: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  }
}));


export default function ObjectBreadcrumbs() {
  const classes = useStyles();
  const pgAdmin = usePgAdmin();
  const preferences = usePreferences().getPreferencesForModule('browser');
  const [objectData, setObjectData] = useState({
    path: null,
    description: null,
  });
  const onItemHover = (item, _data)=>{
    if(item && !_data?._type.startsWith('coll-')) {
      setObjectData({
        path: pgAdmin.Browser.tree.getNodeDisplayPath(item, false),
        description: item?._metadata?.data.description
      });
    } else {
      setObjectData({
        path: null,
        description: null
      });
    }
  };

  useEffect(()=>{
    if(preferences.breadcrumbs_enable) {
      pgAdmin.Browser.Events.on('pgadmin-browser:tree:hovered', onItemHover);
    }
    return ()=>{
      pgAdmin.Browser.Events.off('pgadmin-browser:tree:hovered', onItemHover);
    };
  }, [preferences.breadcrumbs_enable]);

  if(!objectData.path) {
    return <></>;
  }

  return(
    <Box className={classes.root} data-testid="object-breadcrumbs">
      <div className={classes.row}>
        <AccountTreeIcon style={{height: '1rem', marginRight: '0.125rem'}} data-label="AccountTreeIcon"/>
        <div className={classes.overflow}>
          {
            objectData.path?.reduce((res, item, i)=>(
              res.concat(<span key={item+i}>{item}</span>, <ArrowForwardIosRoundedIcon key={item+i+'-arrow'} style={{height: '0.8rem', width: '1.25rem'}} />)
            ), []).slice(0, -1)
          }
        </div>
      </div>
      {preferences.breadcrumbs_show_comment && objectData.description &&
          <div className={classes.row}>
            <CommentIcon style={{height: '1rem', marginRight: '0.125rem'}} data-label="CommentIcon"/>
            <div className={classes.overflow}>{objectData.description}</div>
          </div>}
    </Box>
  );
}
