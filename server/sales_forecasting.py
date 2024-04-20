import pandas as pd
from prophet import Prophet
from prophet.diagnostics import cross_validation
from prophet.diagnostics import performance_metrics
import numpy as np

def forecast(df, col_index, frequency, period):
    
    print(df.columns[0])
    if(df.columns[0].upper()!='DATE'):
        return False

    df = df.iloc[:, [0,col_index]]
    col_name = df.columns[1]
    
    df.columns = ['ds','y']
    df['ds'] = pd.to_datetime(df['ds'])
    
    act_period = period
    
    if frequency == 'Monthly':
        freq = 'M'
        act_period*=30
    
    elif frequency == 'Yearly':
        freq = 'M'
        period*=12
        
    elif frequency == 'Daily':
        freq = 'D'
        act_period*=10
    
    elif frequency=='Weekly':
        freq='D'
        period*=7
        act_period*=7
        
    model = Prophet()
    model.fit(df)
    
    
    future_dates = model.make_future_dataframe(periods=period, freq=freq)
    prediction = model.predict(future_dates)
    
    prediction = prediction.iloc[:, [0,15]]

    forecast = prediction.tail(period)
    forecast.reset_index(drop=True, inplace=True)
    
    
    df_cv = cross_validation(model, initial=f'720 days', period=f'180 days', horizon=f'365 days')
    df_p = performance_metrics(df_cv)
    
    # print(df_p)
    
    rmse = np.round(df_p['rmse'].values[0], 2)
    mse = np.round(df_p['mse'].values[0], 2)
    mae = np.round(df_p['mae'].values[0], 2)
    mape = np.round(df_p['mape'].values[0], 2)
    
    
    metrics = [rmse,mse,mae,mape]
    
    df.columns = ['Date',col_name] 
    forecast.columns = ['Date',col_name]
    
    quantity = (forecast[col_name].sum())
    
    price = (quantity*100)
    
    print(quantity)
    print(price)
    
    result = {
        'forecast_df': forecast,
        'metrics':metrics,
        'act_df':df,
        'attribute':str(col_name),
        'quantity':round((quantity//1000),2),
        'revenue':round((price//1000)*0.001,2)
    }
    
    # print(metrics)
    return result
