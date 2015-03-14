#!/usr/bin/env python
# -*- coding: utf-8 -*-

import json
import numpy as np
import sqlalchemy
import pandas as pd
import datetime
from flask import make_response

def jsonify(obj):
    """Return a Flask ``Response`` object, with the data converted to JSON
    and set with the appropriate headers.
    :Parameters:
      - `obj`: A Python dict of JSON-serializable information
    When in a view, just return jsonify(your_data_dict) from a route
    """
    string = json.dumps(obj, default=str)
    response = make_response(string)
    response.headers['Content-Type'] = 'application/json'
    return response

def preprocess_revenue(query,cursor, value_column, group_by):
    raw = pd.DataFrame(cursor.execute(query).fetchall());
    raw.columns = cursor.execute(query).keys();
    indexed = raw.set_index([value_column, group_by]);
    unstacked = indexed.unstack(group_by);
    filled = unstacked.fillna(0);

    output= [];
    for column in filled.columns:
        output.append(
            {
            'key': column[1],
            'values': [
                {
                'x': datetime.datetime.strptime(str(filled.index[i]), '%Y-%m-%d'),
                'y': float(filled[column].ix[i])
                }
                for i in range(filled.shape[0])
                ]
            }
        )

    return output


def preprocess_cpr(query,cursor, value_column, unstack):
    raw = pd.read_sql(query, cursor, parse_dates=['firstsenddate'], columns=['firstsenddate', 'client', 'cpr']);
    indexed = raw.set_index([value_column, unstack]);
    unstacked = indexed.unstack(unstack).resample('4D', how='mean');
    filled = unstacked.fillna(0);
    output= [];
    for column in filled.columns:
        output.append(
            {
            'key': column[1],
            'values': [
                {
                'x': datetime.datetime.strptime(str(filled.index[i]), '%Y-%m-%d %H:%M:%S'),
                'y': float(filled[column].ix[i])
                }
                for i in range(filled.shape[0])
                ]
            }
        )
    return output

def preprocess_records(query,cursor, value_column, unstack):
    raw = pd.DataFrame(cursor.execute(query).fetchall());
    raw.columns = cursor.execute(query).keys();
    indexed = raw.set_index([value_column, unstack]);
    unstacked = indexed.unstack(unstack);
    filled = unstacked.fillna(0);
    output= [];
    for column in filled.columns:
        output.append(
            {
            'key': column[1],
            'values': [
                {
                'x': datetime.datetime.strptime(str(filled.index[i]), '%Y-%m-%d'),
                'y': float(filled[column].ix[i])
                }
                for i in range(filled.shape[0])
                ]
            }
        )

    return output

def preprocess_send_activity(query,cursor, value_column, unstack):
    raw = pd.read_sql(query, cursor, parse_dates=['senddate'], columns=['senddate', 'client', 'open_rate', 'click_rate', 'clicks_per_open', 'estimated_read_rate']);
    indexed = raw.set_index([value_column, unstack]);
    unstacked = indexed.unstack(unstack).resample('3D', how='mean');
    filled = unstacked.fillna(0);
    output= [];
    for column in filled.columns:
        output.append(
            {
            'key': column[0],
            'values': [
                {
                'x': datetime.datetime.strptime(str(filled.index[i]), '%Y-%m-%d %H:%M:%S'),
                'y': float(filled[column].ix[i])
                }
                for i in range(filled.shape[0])
                ]
            }
        )
    return output
