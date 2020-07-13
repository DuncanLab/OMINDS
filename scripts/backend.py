import pandas as pd
import sys
import json
import os
import shutil
from tkinter import Tk
from tkinter.filedialog import askdirectory

# fields = sys.argv[1]
# fields = json.loads(fields)


def response():

    df = pd.read_csv("full_dt_pf.csv")
    orientation_group = df.groupby("humanmade_pass")
    pass_df = orientation_group.get_group(1)
    fail_df = orientation_group.get_group(0)
    output(pass_df, fail_df)


def output(pass_df, fail_df):
    Tk().withdraw()
    output_dir = askdirectory()
    print(output_dir)

    if os.path.isdir(output_dir):
        shutil.rmtree(output_dir)

    os.makedirs(output_dir)
    pass_dir = os.path.join(output_dir, "positive_data")
    fail_dir = os.path.join(output_dir, "negative_data")
    os.makedirs(pass_dir)
    os.makedirs(fail_dir)

    current_path = os.path.abspath(os.getcwd())

    for stimulus in pass_df.stimulus:
        input_path = os.path.join(os.path.abspath(
            os.getcwd()), "objects", stimulus)
        output_path = os.path.join(pass_dir, stimulus)
        shutil.copyfile(input_path, output_path)

    for stimulus in fail_df.stimulus:
        input_path = os.path.join(os.path.abspath(
            os.getcwd()), "objects", stimulus)
        output_path = os.path.join(fail_dir, stimulus)
        shutil.copyfile(input_path, output_path)


response()
# print(response(fields))
sys.stdout.flush()
