import sqlalchemy
import pandas as pd
from flask import (
    Flask,
    render_template,
    g,
    redirect,
    url_for,
    request,
    session,
    make_response,
    send_from_directory
)
import csv
import fileinput
import pandas as pd
import utils

app = Flask(__name__)
app.config.from_pyfile('configs/development.py')

url = sqlalchemy.engine.url.URL('mysql',
                                username=app.config['HB_USERNAME'],
                                password=app.config['HB_PASSWORD'],
                                host=app.config['HB_HOST'],
                                port=app.config['HB_PORT'],
                                database=app.config['HB_DB'])
engine = sqlalchemy.create_engine(url)
cursor = engine.connect();


@app.route('/', methods=['GET','POST'])
@app.route('/dash', methods=['GET','POST'])
def dash():
    query = '''select distinct client from gatekeeper_lists '''
    raw = pd.DataFrame(cursor.execute(query).fetchall());
    raw.columns = cursor.execute(query).keys();
    clientnames = list(raw['client'].values)
    clientnames.append('all')
    return render_template('dash.j2', clientnames = clientnames, client='avenue100')

@app.route('/activity/client', defaults={'client':'avenue100'})
@app.route('/activity/client/<string:client>')
def activity(client):
    query1 = '''select distinct client from gatekeeper_lists '''
    raw = pd.DataFrame(cursor.execute(query1).fetchall());
    raw.columns = cursor.execute(query1).keys();
    clientnames = list(raw['client'].values)

    query_head = '''
        SELECT t1.client as clients, t1.offer as offers, t2.sending_domain as sender_domains, t2.domain_group as domain_groups
        FROM template_options t1 JOIN template_sender_domains t2
        ON t1.name = t2.name
        WHERE (t1.weight > 0 or t1.gmail_weight > 0)
        AND client = '{0}'
        '''.format(client)
    query_head += '''Group by clients, offers, sender_domains, domain_groups'''
    query = query_head
    raw = pd.DataFrame(cursor.execute(query).fetchall());
    raw.columns = cursor.execute(query).keys();
    offers = pd.unique(raw['offers'].ravel())
    domain_groups = pd.unique(raw['domain_groups'].ravel())
    sender_domains = pd.unique(raw['sender_domains'].ravel())
    return render_template('activity.j2', clientnames = clientnames, offers = offers, sender_domains = sender_domains, domain_groups = domain_groups, client=client)


@app.route('/alerts', methods=['GET','POST'])
def alerts():
    # query = ''' '''
    # raw = pd.DataFrame(cursor.execute(query).fetchall());
    # raw.columns = cursor.execute(query).keys();
    # clients = list(raw['client'].values)
    # clients.append('all')
    return render_template('alerts.j2')

@app.route('/api/cpr_yahoo')
def cpr_yahoo(client='all'):
    client = request.args.get('client')

    query_head = '''
                SELECT firstsenddate, client,
                sum(sum)/sum(count) as cpr
                FROM honeybadger_scratch.dashboard_cpr
                WHERE firstsenddate > curdate() - interval 45 day
                AND email_domain = 'yahoo'
                '''

    if client != 'all':
        query_head += '''And client = '{0}' '''.format(client)
        query_head += ''' GROUP BY firstsenddate '''
    if client == 'all':
        query_head += ''' GROUP BY firstsenddate, client '''
    query_head += ''' ORDER BY firstsenddate '''
    query = query_head
    output = utils.preprocess_cpr(query, engine, 'firstsenddate', 'client')
    return utils.jsonify(output)

@app.route('/api/revenue')
def revenue(domain_group='all', client='all', group_by ='client'):
    domain_group = request.args.get('domain_group')
    client = request.args.get('client')
    group_by = request.args.get('group_by')
    if group_by != 'all':
        query_head = '''
                    SELECT date_ts, {0}, sum(revenue)
                    FROM honeybadger_scratch.hb_rev_domainclientdate
                    WHERE date_ts > curdate() - interval 30 day
                    '''.format(group_by)

    if domain_group != 'all':
        query_head += ''' And domain_group = '{0}' '''.format(domain_group)
    if client != 'all':
        query_head += '''And client = '{0}' '''.format(client)
    if group_by != 'all':
        query_head += ''' GROUP BY date_ts, {0} '''.format(group_by)
    query = query_head
    output = utils.preprocess_revenue(query, cursor, 'date_ts', group_by)
    return utils.jsonify(output)

@app.route('/api/cpr_gmail')
def cpr_gmail(client='all'):
    client = request.args.get('client')

    query_head = '''
                SELECT firstsenddate, client,
                sum(sum)/sum(count) as cpr
                FROM honeybadger_scratch.dashboard_cpr
                WHERE firstsenddate > curdate() - interval 45 day
                AND email_domain = 'gmail.com'
                '''

    if client != 'all':
        query_head += '''And client = '{0}' '''.format(client)
        query_head += ''' GROUP BY firstsenddate '''
    if client == 'all':
        query_head += ''' GROUP BY firstsenddate, client '''
    query_head += ''' ORDER BY firstsenddate '''

    query = query_head
    output = utils.preprocess_cpr(query, engine, 'firstsenddate', 'client')
    return utils.jsonify(output)

@app.route('/api/records_yahoo')
def records_yahoo(client='all'):
    client = request.args.get('client')

    query_head = '''
    SELECT received_date, email_received, sum(yahoo) as yahoo
    FROM honeybadger_scratch.dashboard_records
    WHERE received_date > current_date - interval 11 day
    '''

    if client != 'all':
        query_head += '''AND client = '{0}' '''.format(client)
    query_head += '''GROUP BY received_date, email_received '''

    query = query_head
    output = utils.preprocess_records(query, cursor, 'received_date', 'email_received')
    return utils.jsonify(output)

@app.route('/api/records_gmail')
def records_gmail(client='all'):
    client = request.args.get('client')

    query_head = '''
    SELECT received_date, email_received, sum(gmail) as gmail
    FROM honeybadger_scratch.dashboard_records
    WHERE received_date > current_date - interval 11 day
    '''

    if client != 'all':
        query_head += '''AND client = '{0}' '''.format(client)
    query_head += '''GROUP BY received_date, email_received '''

    query = query_head
    output = utils.preprocess_records(query, cursor, 'received_date', 'email_received')
    return utils.jsonify(output)

@app.route('/api/records_hotmail')
def records_hotmail(client='all'):
    client = request.args.get('client')

    query_head = '''
    SELECT received_date, email_received, sum(hotmail) as hotmail
    FROM honeybadger_scratch.dashboard_records
    WHERE received_date > current_date - interval 11 day
    '''

    if client != 'all':
        query_head += '''AND client = '{0}' '''.format(client)
    query_head += '''GROUP BY received_date, email_received '''
    query = query_head
    output = utils.preprocess_records(query, cursor, 'received_date', 'email_received')
    return utils.jsonify(output)

@app.route('/api/records_aol')
def records_aol(client='all'):
    client = request.args.get('client')

    query_head = '''
    SELECT received_date, email_received, sum(aol) as aol
    FROM honeybadger_scratch.dashboard_records
    WHERE received_date > current_date - interval 11 day
    '''

    if client != 'all':
        query_head += '''AND client = '{0}' '''.format(client)
    query_head += '''GROUP BY received_date, email_received '''
    query = query_head
    output = utils.preprocess_records(query, cursor, 'received_date', 'email_received')
    return utils.jsonify(output)

@app.route('/api/send_activity/')
def send_activity(client='avenue100', offer='all', domain_group='all', sender_domain='all'):
    client = request.args.get('client')
    offer = request.args.get('offer')
    domain_group = request.args.get('domain_group')
    sender_domain = request.args.get('sender_domain')
    query_head = '''
     SELECT
        	senddate,
        	client,
        	sum(opens)/sum(sends) as open_rate ,
        	sum(clicks)/sum(sends) as click_rate ,
        	sum(clicks)/sum(opens) as clicks_per_opens ,
        	sum(opens)/sum(sends) * sum(clicks) / sum(clicks_with_opens) AS estimated_read_rate
        FROM
    	   honeybadger_scratch.dashboard_send_activity
        WHERE
        	senddate > CURRENT_DATE - INTERVAL 45 DAY
            and senddate < current_date
        AND client = '{0}'
    '''.format(client)

    if domain_group != 'all':
        query_head += ''' AND domain_group = '{0}' '''.format(domain_group)
    if offer != 'all':
        query_head += ''' AND send_offer = '{0}' '''.format(offer)
    if sender_domain != 'all':
        query_head += ''' AND sender_domain = '{0}' '''.format(sender_domain)

    query_head += '''Group by 1,2'''
    query = query_head
    query = query_head
    output = utils.preprocess_send_activity(query, engine, 'senddate', 'client')
    return utils.jsonify(output)


if __name__ == '__main__':
    app.run(debug=True)
