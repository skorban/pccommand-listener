@echo off
pushd .
cd "%~dp0\.."
set APP_DIR=%cd%
popd
set SIGN_DIR=%APP_DIR%\code_sign
set TARGET=%APP_DIR%\build\pccommand-listener.exe
@echo on
"%SIGN_DIR%\signtool.exe" sign /f "%SIGN_DIR%\2015_2017.pfx" /ac "%SIGN_DIR%\thawte_intermediate.cer" /p Pr*foundY0UI /d "Profound UI PC Command Listener" /t "http://timestamp.verisign.com/scripts/timstamp.dll", "%TARGET%"